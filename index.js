const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Verificar si Chromium está instalado, instalar si no
(async () => {
  try {
    const puppeteerModule = require('puppeteer');

    // Esto normalmente devuelve un path si Chromium está presente
    const executablePath = puppeteerModule.executablePath();

    if (!executablePath || executablePath === '') {
      console.log('⏳ Chromium no encontrado, intentando instalar...');
      await puppeteerModule.install();
      console.log('✅ Chromium instalado correctamente');
    } else {
      console.log('✅ Chromium ya disponible');
    }
  } catch (err) {
    console.error('❌ Error verificando o instalando Chromium:', err.message);
  }
})();

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// Ruta de scraping
app.post('/scrape', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL no proporcionada" });
  }

  try {
    const browser = await puppeteer.launch({
      executablePath: require('puppeteer').executablePath(),
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });

    const data = await page.evaluate(() => {
      const title = document.title;
      const description = document.querySelector('meta[name="description"]')?.content || null;
      return { title, description };
    });

    await browser.close();

    res.status(200).json({ message: 'Scraping exitoso ✅', data });

  } catch (error) {
    console.error('Error en el scraper:', error.message);
    res.status(500).json({ error: 'Scraping falló ❌', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});




