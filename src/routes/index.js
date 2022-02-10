const { Router } = require('express');
const router = Router();
const pupppeteer = require('puppeteer')
const fs = require('fs');


const dir = './public/images';
const public_path = 'http://localhost:3000/images/';



const generarId = () => {
    const random = Math.random().toString(36).substr(2);
    const fecha = Date.now().toString(36)

    return random + fecha
}

async function run(url){
    let response;
    try {
        const browser = await pupppeteer.launch({
            "args": [
                '--disable-setuid-sandbox',
                '--no-sandbox'
            ]
        })
        const page = await browser.newPage()
        await page.goto(url)
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        const capture_name = `${generarId()}.png`;
        const screenshot_name = capture_name
        const path = `${dir}/${screenshot_name}`
        await page.screenshot({
            path: path,
            fullPage: true
        })
        const full_path = public_path + screenshot_name;
        await browser.close()
        response = {
            'response' : 'success',
            'msg': 'Captura obtenida correctamente',
            'url': `${full_path}`
        }
    } catch (error) {
        response = {
            'response': 'error',
            'msg': 'Lo sentimos, hubo un error al obtener la captura',
            'error': error.originalMessage
        };
    }

    return response;
}

router.get('/screenshot', async (req, res) => {
    const url = req.query.url;
    console.log(run(url))
    const response = await run(url);
    res.json(response)
})

router.get('/delete_screenshots/:password', (req, res) => {
    const password = req.params.password;

    if(password === ''){
        fs.rmdir(dir, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        
            console.log(`${dir} is deleted!`);
            res.json({
                'reponse': 'success',
                'msg': 'Todas las capturas se han eliminado correctamente'
            })
        });
    }
    
})


module.exports = router;
