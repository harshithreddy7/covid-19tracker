import React,{useState,useEffect} from 'react';
import './App.css';
import { Select,FormControl, MenuItem, Card,CardContent } from '@material-ui/core';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import {sortData,prettyPrintStat} from  "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";


function App() {
  
  const [countries,setCountries]= useState([]);
  const [country,setCountry] = useState('worldwide');
  const [countryInfo , setCountryInfo] = useState({});
  const [tableData, setTableData ] = useState([]);
  const[mapCenter ,setMapCenter] = useState({lat : 34.80746, lng : -40.4796});
  const[mapZoom, setMapZoom] = useState(3);
  const[mapCountries,setMapCountries] = useState([]);
  const [casesType,setCasesType] = useState("cases");

  useEffect(() =>{
    //useEffect()-> load ones when the component loads,[some conditon]->when ever it changes
    //async -> send a req to the server,and wait until it responses

    const getCountriesData = async() =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json())
      .then((data)=>{
        const countries = data.map((country) =>(
          {
          name: country.country,
          value :country.countryInfo.iso2,

          }));
          const sortedData = sortData(data);
          setMapCountries(data);
          setTableData(sortedData);
          setCountries(countries);
      });
    };
    getCountriesData();
  },[]);
  useEffect(() =>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) =>{
      setCountryInfo(data);
    });
  },[]);


  const onCountryChange = async (event) =>{
    const countryCode =event.target.value;
    setCountry(countryCode);
    const url = 
      countryCode === "worldwide" 
      ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await  fetch(url)
      .then(response => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);


        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
    
   };
    
  return (
    <div className="app">
     
      <div className = "app_left">
        <div className ="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className ="app_downdrop">
            <Select variant ="outlined" onChange ={onCountryChange} value ={country}>
              <MenuItem value ="worldwide" >Worldwide</MenuItem>
                {countries.map((country) => (
                <MenuItem value={country.value}>{country.name }</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats" >
          <InfoBox title ="Coronavirus cases" 
            isRed
            active={casesType ==="cases"}
            onClick =  {(e) => setCasesType('cases')}
            cases ={prettyPrintStat(countryInfo.todayCases)} 
            total = {prettyPrintStat(countryInfo.cases)}/>
          <InfoBox title ="Recoverd " 
            active={casesType ==="recovered"}
           onClick = { (e) => setCasesType('recovered')}
            cases ={prettyPrintStat(countryInfo.todayRecovered )} 
            total = {prettyPrintStat(countryInfo.recovered)} />
          <InfoBox title ="Deaths" 
            isRed
            active={casesType ==="deaths"}
            onClick = {(e) => setCasesType('deaths')}
            cases ={prettyPrintStat(countryInfo.todayDeaths)} 
            total = {prettyPrintStat(countryInfo.deaths)}/>
        </div>
        <div className = "app_map">
          <Map 
            casesType ={casesType}
            countries={mapCountries}
            center ={mapCenter} zoom ={mapZoom}/>

        </div>
      </div>
      <Card className ="app_right">
        <CardContent>
          <h3>Live cases by contry</h3>
          <Table countries ={tableData}/>
          <h3 className= "app_graphTitle" >World wide new {casesType}</h3>
          <LineGraph  className ="app_graph" casesType ={casesType}/> 
        </CardContent>

      </Card>
      
      {/* <div className ="app_bottom"> */}
        {/* <h1>My details</h1> */}
      {/* </div> */}
    </div>
  );
}

export default App;
