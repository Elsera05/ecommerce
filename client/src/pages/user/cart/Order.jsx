import { Box, Button, Typography } from "@mui/material";
import SelectOptions from "./SelectOptions";
import { useEffect, useState } from "react";
import {
  useGetCitiesQuery,
  useGetProvincesQuery,
  useGetServicesQuery,
} from "../../../state/api/shipmentApi";
import { useSelector } from "react-redux";
import { useGetTokenMutation } from "../../../state/api/paymentApi";
import { useCartOrderMutation } from "../../../state/api/orderApi";
import iziToast from "izitoast";

const Order = ({ subtotal, totalWeight, products }) => {
  const { user } = useSelector((state) => state.auth);
  const [getToken, { isLoading, data }] = useGetTokenMutation();
  const [cartOrder, { isSuccess, reset }] = useCartOrderMutation();

  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [courier, setCourier] = useState("");
  const [service, setService] = useState("");
  const [address, setAddress] = useState("");

  const origin = "78";

  const { data: provinces } = useGetProvincesQuery();
  const { data: cities } = useGetCitiesQuery(province, { skip: !province });
  const { data: servicesData } = useGetServicesQuery(
    { origin, destination: city, weight: totalWeight, courier },
    { skip: !city || !courier }
  );

  const services = servicesData && servicesData[0]?.costs;

  const total = subtotal + service;

  const id = Date.now();
  const token = data?.token;

  const buyHandler = () => {
    if (!address) {
      return iziToast.error({
        title: "Error",
        message: "Masukan alamat",
        position: "topRight",
        timeout: 3000,
      });
    }

    const data = {
      orderId: id,
      amount: total,
      name: user?.name,
      email: user?.username,
      phone: user?.phone,
    };

    getToken(data);
  };

  useEffect(() => {
    if (token) {
      window.snap.pay(token, {
        onSuccess: (result) => {
          const data = {
            orderId: result.order_id,
            user: user?._id,
            address: address,
            phone: user?.phone,
            subtotal: subtotal,
            payment: total,
            paymentStatus: result.transaction_status,
            shippingCost: service,
            products: products?.map((product) => ({
              productId: product.productId,
              qty: product.qty,
              totalPrice: product.totalPrice,
              profit: product.profit,
            })),
          };

          cartOrder(data);
        },
        onPending: (result) => {
          const data = {
            orderId: result.order_id,
            user: user?._id,
            address: address,
            phone: user?.phone,
            subtotal: subtotal,
            payment: total,
            paymentStatus: result.transaction_status,
            shippingCost: service,
            products: products?.map((product) => ({
              productId: product.productId,
              qty: product.qty,
              totalPrice: product.totalPrice,
              profit: product.profit,
            })),
          };

          cartOrder(data);

          window.location.href = "/confirmation";
        },
        onError: (error) => {
          iziToast.error({
            title: "Error",
            message: error,
            position: "topRight",
            timeout: 3000,
          });
        },
        onClose: () => {
          iziToast.info({
            title: "Info",
            message: "Segera lakukan pembayaran",
            position: "topRight",
            timeout: 3000,
          });
        },
      });
    }
  }, [token]);

  useEffect(() => {
    const midtransScriptUrl = import.meta.env.VITE_MIDTRANS_URL;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;

    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_KEY;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "80%" },
        borderRadius: "10px",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "560px",
        boxShadow: 6,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <Typography fontWeight="bold" fontSize={18}>
          Subtotal
        </Typography>

        <Typography fontWeight="bold" fontSize={20}>
          Rp {subtotal && subtotal.toLocaleString("id-ID")}
        </Typography>
      </Box>

      <Typography fontWeight="bold">Alamat Pengiriman</Typography>

      <Box>
        <SelectOptions
          provinsi={(p) => setProvince(p)}
          kota={(c) => setCity(c)}
          kurir={(c) => setCourier(c)}
          layanan={(s) => setService(s)}
          alamat={(a) => setAddress(a)}
          provinces={provinces}
          cities={cities}
          services={services}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <Typography fontWeight="bold" fontSize={18}>
          Ongkir
        </Typography>

        <Typography fontWeight="bold" fontSize={20}>
          Rp {parseFloat(service ? service : 0).toLocaleString("id-ID")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <Typography fontWeight="bold" fontSize={18}>
          Total
        </Typography>

        <Typography fontWeight="bold" fontSize={20}>
          Rp {parseFloat(total).toLocaleString("id-ID")}
        </Typography>
      </Box>

      <Button variant="contained" onClick={buyHandler}>
        {isLoading ? "..." : "Beli"}
      </Button>
    </Box>
  );
};

export default Order;
