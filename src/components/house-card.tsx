import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Popover,
  Typography,
} from "@mui/material";
import { HouseType } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import { MouseEvent, useState } from "react";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { setOpenedSnack, setSeverity, setSnackMessage } from "../slices/snackbar.slice";
import $api from "../http/api";
import { setHouse, setHouses, setHouseState, setOpenedDialog } from "../slices/house.slice";
import nf from "@tuplo/numberfmt";

export default function HouseCard({ house }: { house: HouseType }) {
  const { user } = useSelector((state: RootState) => state.user);
  const { theme } = useSelector((state: RootState) => state.theme);
  const { houses } = useSelector((state: RootState) => state.house);
  const { currency, curVal } = useSelector((state: RootState) => state.currency);
  const [expanded, setExpanded] = useState(false);
  const [openedPop, setOpenedPop] = useState(false);
  const [openedAlert, setOpenedAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);
  const dispatch = useDispatch();

  const onDeleteHouse = async (houseId: number) => {
    try {
      setIsLoading(true);
      const { data } = await $api.delete(`/house/delete/${houseId}`);
      dispatch(setHouses(houses.filter(house => +house.id !== houseId)));
      setOpenedAlert(false);
      setOpenedPop(false);
      dispatch(setOpenedSnack(true));
      dispatch(setSeverity("success"));
      dispatch(setSnackMessage(data.message));
      // @ts-ignore
    } catch (error: AxiosError) {
      dispatch(setOpenedSnack(true));
      dispatch(setSeverity("error"));
      dispatch(setSnackMessage(error.response.data.message!));
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   dispatch(setInitialPrice(house.price));

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [house.price]);

  return (
    <>
      <Card
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          border: "1px solid green",
          position: "relative",
        }}
        className="w-full"
      >
        <CardHeader
          sx={{ color: `${theme === "dark" ? "white" : "black"}` }}
          avatar={
            <Avatar
              sx={{
                bgcolor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
                  Math.random() * 255
                })`,
              }}
              aria-label="recipe"
            >
              {house.owner.username?.at(0)?.toUpperCase()}
            </Avatar>
          }
          title={house.owner.email}
          subheader={house.owner.phone}
          subheaderTypographyProps={{ color: `${theme === "dark" ? "white" : "black"}` }}
        />
        <CardMedia
          component="img"
          height="194"
          image={`${process.env.API_URL!}/${house.image}`}
          alt={house.label}
        />
        <CardContent className="flex justify-between flex-col gap-2">
          <Typography
            variant="h5"
            sx={{
              color: "primary.contrastText",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="line-clamp-2"
          >
            <span>{house.label}</span>
            {+house.owner.id === +user.id && (
              <span
                className="cursor-pointer rounded-full hover:bg-transparent/25 w-8 -h-8 flex items-center justify-center p-1"
                onClick={(e: MouseEvent<HTMLSpanElement>) => {
                  setAnchorEl(e.currentTarget);
                  setOpenedPop(true);
                }}
              >
                <MoreVertSharpIcon color="success" className="text-center" />
              </span>
            )}
          </Typography>
          <Typography variant="h6" sx={{ color: "primary.contrastText", textAlign: "right" }}>
            {nf(house.price * curVal, "0a")}
            <span className="text-green-500 pl-1">{currency.toUpperCase()}</span>
          </Typography>
          <div
            className="underline text-green-500 cursor-pointer text-center"
            onClick={() => setExpanded(true)}
          >
            Show more
          </div>
        </CardContent>
        <CardActions disableSpacing></CardActions>
      </Card>
      <Dialog open={expanded} onClose={() => setExpanded(false)}>
        <DialogContent sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
          <DialogActions>
            <span className="cursor-pointer" onClick={() => setExpanded(false)}>
              <CloseSharpIcon />
            </span>
          </DialogActions>
          {house.body}
        </DialogContent>
      </Dialog>
      <Popover
        open={openedPop}
        anchorEl={anchorEl}
        onClose={() => setOpenedPop(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div
          className="p-1 border-b-2 border-black text-green-500 cursor-pointer hover:bg-gray-200"
          onClick={() => {
            dispatch(setHouseState("edit"));
            dispatch(setOpenedDialog(true));
            dispatch(setHouse(house));
            setOpenedPop(false);
          }}
        >
          Edit house
        </div>
        <div
          className="p-1 text-red-500 cursor-pointer hover:bg-gray-200"
          onClick={() => setOpenedAlert(true)}
        >
          Delete house
        </div>
      </Popover>
      <Dialog
        open={openedAlert}
        onClose={() => {
          setOpenedAlert(false);
          setOpenedPop(false);
        }}
      >
        <DialogContent sx={{ bgcolor: "primary.main" }}>
          <DialogContentText sx={{ color: "primary.contrastText", marginBottom: 1 }}>
            Are you sure to delete this one of the your houses?
          </DialogContentText>
          <DialogActions>
            <Button
              color="success"
              variant="outlined"
              onClick={() => {
                setOpenedAlert(false);
                setOpenedPop(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => onDeleteHouse(+house.id)}
              disabled={isLoading}
            >
              Delete
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
