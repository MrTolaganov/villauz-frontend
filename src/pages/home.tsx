import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useQuery } from "@tanstack/react-query";
import $axios from "../http/axios";
import { setHouses } from "../slices/house.slice";
import HouseCard from "../components/house-card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UserType } from "../types";

export default function Home({ user }: { user: UserType }) {
  const { houses } = useSelector((state: RootState) => state.house);
  const { isAuth } = useSelector((state: RootState) => state.authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useQuery({
    queryKey: ["all-houses"],
    queryFn: async () => {
      const { data } = await $axios.get("/house/gethouses");
      dispatch(setHouses(data.houses));
      return data;
    },
  });

  useEffect(() => {
    // const timeout = setTimeout(() => {
      if (isAuth && !user.activated) {
        navigate("/activation");
      }
    // }, 2000);
    // return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, user.activated]);

  return (
    <main className="mt-[10vh] text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto">
        {houses &&
          houses
            .slice()
            .reverse()
            .map(house => <HouseCard key={house.id} house={house} />)}
      </div>
    </main>
  );
}
