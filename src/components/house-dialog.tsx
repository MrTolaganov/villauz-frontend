import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setHouses, setOpenedDialog } from "../slices/house.slice";
import { ChangeEvent, useEffect, useState } from "react";
import { initialHouseDataState } from "../constants";
import { HouseType } from "../types";
import $api from "../http/api";
import { useNavigate } from "react-router-dom";
import $axios from "../http/axios";

export default function HouseDialog() {
  const { houseState, openedDialog } = useSelector((state: RootState) => state.house);
  const { theme } = useSelector((state: RootState) => state.theme);
  const { houses, house } = useSelector((state: RootState) => state.house);
  const [houseData, setHouseData] = useState<HouseType>(initialHouseDataState);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((houseState === "add" && !file) || !houseData.label || !houseData.body || !houseData.price)
      return;
    setIsLoading(true);

    if (houseState === "add") {
      const formData = new FormData();
      formData.append("label", houseData.label);
      formData.append("body", houseData.body);
      formData.append("price", `${houseData.price}`);
      formData.append("image", file as File);
      const { data } = await $api.post("/house/create", formData);
      // dispatch(setHouse({ ...data.house } as HouseType));
      dispatch(setHouses([...houses, data.house as HouseType] as HouseType[]));
    } else {
      const { data } = await $api.put(`/house/update/${house?.id}`, {
        label: houseData.label,
        body: houseData.body,
        price: houseData.price,
      });
      // @ts-ignore
      dispatch(setHouses(houses.map(h => (+h.id === +house?.id ? data.house : h))));
    }
    setIsLoading(false);
    dispatch(setOpenedDialog(false));
    setHouseData(initialHouseDataState);
    navigate("/");
  };

  const getHouseData = async () => {
    if (houseState === "edit") {
      const { data } = await $axios.get(`/house/gethouse/${house?.id}`);
      setHouseData({ ...data.house });
    } else {
      setHouseData(initialHouseDataState);
    }
  };

  useEffect(() => {
    getHouseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedDialog]);

  return (
    <Dialog open={openedDialog} onClose={() => dispatch(setOpenedDialog(false))} fullWidth>
      <DialogContent sx={{ bgcolor: "primary.main" }}>
        <DialogTitle sx={{ color: "greenyellow", textAlign: "center" }}>
          {houseState === "add" ? "Add house" : "Edit house"}
        </DialogTitle>
        <form action="" className="flex flex-col gap-2 items-center" onSubmit={handleSubmit}>
          <div
            className={`w-full md:w-3/4 flex flex-col ${
              theme === "dark" ? "dark:text-white" : "text-black"
            } gap-1`}
          >
            <label htmlFor="label">Label</label>
            <input
              type="text"
              id="label"
              className={`p-2 ${theme === "dark" ? "dark:bg-slate-950" : "bg-gray-100"}`}
              value={houseData.label}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setHouseData({ ...houseData, label: e.target.value! })
              }
            />
          </div>
          <div
            className={`w-full md:w-3/4 flex flex-col ${
              theme === "dark" ? "dark:text-white" : "text-black"
            } gap-1`}
          >
            <label htmlFor="body">Body</label>
            <input
              type="body"
              id="body"
              className={`p-2 ${theme === "dark" ? "dark:bg-slate-950" : "bg-gray-100"}`}
              value={houseData.body}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setHouseData({ ...houseData, body: e.target.value! })
              }
            />
          </div>
          <div
            className={`w-full md:w-3/4 flex flex-col ${
              theme === "dark" ? "dark:text-white" : "text-black"
            } gap-1`}
          >
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              className={`p-2 ${theme === "dark" ? "dark:bg-slate-950" : "bg-gray-100"}`}
              placeholder="$"
              value={houseData.price ? houseData.price : ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setHouseData({ ...houseData, price: +e.target.value! })
              }
            />
          </div>
          {houseState === "add" && (
            <div
              className={`w-full md:w-3/4 flex flex-col ${
                theme === "dark" ? "dark:text-white" : "text-black"
              } gap-1`}
            >
              <label htmlFor="images">Images</label>
              <input
                type="file"
                id="images"
                className={`p-2 ${theme === "dark" ? "dark:bg-slate-950" : "bg-gray-100"}`}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setFile(e.target.files && e.target.files[0]);
                }}
              />
            </div>
          )}
          <div className="w-full md:w-3/4">
            <Button
              fullWidth
              type="submit"
              color="success"
              variant="contained"
              disabled={isLoading}
              sx={{ marginTop: 2 }}
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
