import { Typography } from "@mui/material";

export const Bar = () => {
  return (
    <>
      <div className="w-full h-16 flex items-center" style={{ background: "rgb(43, 44, 64)", boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 10px 0px" }}>
        <Typography sx={{ fontSize: "25px", fontWeight: "bold", marginLeft: "18px" }}>Learn English</Typography>
      </div>
    </>
  );
};
