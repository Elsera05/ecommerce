import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

const SelectOptions = ({
  provinsi,
  kota,
  kurir,
  layanan,
  alamat,
  provinces,
  cities,
  services,
}) => {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [courier, setCourier] = useState("");
  const [service, setService] = useState("");
  const [address, setAddress] = useState("");

  const handleProvice = (event) => {
    setProvince(event.target.value);
    provinsi(event.target.value);
  };

  const handleCity = (event) => {
    setCity(event.target.value);
    kota(event.target.value);
  };

  const handleCourier = (event) => {
    setCourier(event.target.value);
    kurir(event.target.value);
  };

  const handleService = (event) => {
    setService(event.target.value);
    layanan(event.target.value);
  };

  useEffect(() => {
    alamat(address);
  }, [address]);

  return (
    <Box
      sx={{
        minWidth: 120,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Provinsi</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={province}
          label="Provinsi"
          onChange={handleProvice}
        >
          {provinces?.map((item) => (
            <MenuItem key={item.province_id} value={item.province_id}>
              {item.province}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Kota / Kabupaten</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={city}
          label="Kota / Kabupaten"
          onChange={handleCity}
        >
          {cities?.map((item) => (
            <MenuItem
              key={item.city_id}
              value={item.city_id}
            >{`${item.type} ${item.city_name}`}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Kurir</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={courier}
          label="Kurir"
          onChange={handleCourier}
        >
          <MenuItem value="pos">pos</MenuItem>
          <MenuItem value="jne">jne</MenuItem>
          <MenuItem value="tiki">tiki</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Layanan</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={service}
          label="Layanan"
          onChange={handleService}
        >
          {services?.map((item) => (
            <MenuItem key={item.service} value={item.cost[0].value}>{`${
              item.service
            } Rp ${parseFloat(item.cost[0].value).toLocaleString("id-ID")} ${
              item.cost[0].etd
            } Hari`}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <textarea
        placeholder="Masukan Alamat"
        style={{ padding: "10px" }}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
    </Box>
  );
};

export default SelectOptions;
