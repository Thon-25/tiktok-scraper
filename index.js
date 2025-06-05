const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// Ruta POST /scrape para recibir URL
app.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      throw new Error("URL no proporcionada");
    }

    console.log("URL recibida:", url);  // Log para verificar que llega
    res.status(200).json({ message: `URL recibida correctamente: ${url}` });

  } catch (error) {
    console.error('Error en /scrape:', error.message);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

