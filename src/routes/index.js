const { Router, response } = require('express');
const router = Router();
const pupppeteer = require('puppeteer')
const fs = require('fs');
const AWS = require('aws-sdk');


var dir = './public/images';


const generarId = () => {
    const random = Math.random().toString(36).substr(2);
    const fecha = Date.now().toString(36)

    return random + fecha
}

async function run(url){
    const browser = await pupppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    const screenshot_name = `${generarId()}.png`
    console.log(screenshot_name)
    const response = screenshot_name
    await page.screenshot({
        path: `${dir}/${screenshot_name}`,
        fullPage: true
    })
    await browser.close()

    return `http://localhost:3000/images/${screenshot_name}`;
}

router.get('/screenshot', async (req, res) => {
    const url = req.query.url;
    console.log(run(url))
    const response = await run(url);
    res.json({
        'response': 'success',
        'msg': 'Captura obtenida correctamente',
        'url': response,
    })
})


module.exports = router;