import { Box } from "@mui/material";
import { useGetStoreDataQuery } from "../../state/api/storeApi";

const Footer = () => {
  const year = new Date().getFullYear();
  const { data: store } = useGetStoreDataQuery();

  return (
    <Box
      sx={{
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      &copy; { store?.name } {year}
    </Box>
  );
};

export default Footer;
