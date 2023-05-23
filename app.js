const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://2023-seoul-data-contest-gqmilcvqu-skywings-kor.vercel.app/maps',  // React 앱이 구동되는 주소
}));

const connection = mysql.createConnection({
  host: 'toolrentaloffice.coqcexjiecvx.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'admin3624',
  database: 'ToolRentalOffice',
  port     : 3306
});

const region = [
  {junglang: '중랑구'},
  {jung: '중구'},
  {jongro: '종로구'},
  {enpyeong: '은평구'},
  {yongsan: '용산구'},
  {yeongdengpo: '영등포구'},
  {yancheon: '양천구'},
  {songpa: '송파구'},
  {seongbuk: '성북구'},
  {seongdong: '성동구'},
  {seocho: '서초구'},
  {seoulsi: '서울시'},
  {seodaemun: '서대문구'},
  {mapo: '마포구'},
  {dongjak: '동작구'},
  {dongdaemun: '동대문구'},
  {dobong: '도봉구'},
  {nowon: '노원구'},
  {gmcheon: '금천구'},
  {guro: '구로구'},
  {gwangjin: '광진구'},
  {gwanak: '관악구'},
  {gangseo: '강서구'},
  {gangbuk: '강북구'},
  {gangdong: '강동구'},
  {gangnam: '강남구'}
]

app.get('/', (req, res) => {
  res.send('MarkedMapApi');
});

app.get('/all', (req, res) => {
  const sql = 
  "SELECT DISTINCT o.category, o.name, o.region, o.detailaddress, o.latitude, o.longitude, o.dayopentime, o.dayclosetime, t.telephone FROM RentalOffice o LEFT OUTER JOIN RentalTool t ON t.placename = o.name"

  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).send({ error: 'Internal server error' });
      return;
    }
    res.send(results);
  });
});

for(let e of region){
  for(let [key, value] of Object.entries(e)){
    app.get(`/${key}`, (req, res) => {
      const sql = 
      `SELECT DISTINCT o.category, o.name, o.region, o.detailaddress, o.latitude, o.longitude, o.dayopentime, o.dayclosetime, t.telephone
      FROM RentalOffice o 
      LEFT OUTER JOIN RentalTool t ON t.placename = o.name
      WHERE o.region LIKE "${value}"`;
      
      connection.query(sql, (error, results, fields) => {
        if (error) {
          res.status(500).send({ error: 'Internal server error' });
          return;
        }
        res.send(results);
      });
    });
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));