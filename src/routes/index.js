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


module.exports = router;
