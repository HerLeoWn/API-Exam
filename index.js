import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('weather', { weather: null, city: null, error: null });
});

app.post('/', async (req, res) => {
  const city = req.body.city;
  try {
    const response = await axios.get(`https://goweather.herokuapp.com/weather/${city}`);
    const data = response.data;

    if (!data || !data.temperature) {
      throw new Error('Veri bulunamadı');
    }

    res.render('weather', {
      city: city,
      weather: {
        temperature: data.temperature,
        wind: data.wind,
        description: data.description
      },
      error: null
    });
  } catch (err) {
    res.render('weather', {
      weather: null,
      city: null,
      error: 'Şehir bulunamadı veya API hatası!'
    });
  }
});

app.listen(3000, () => {
  console.log('Sunucu çalışıyor http://localhost:3000');
});
