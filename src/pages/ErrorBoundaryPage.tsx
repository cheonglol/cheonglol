import { useRouteError } from "react-router-dom";
import AppIcon from "../components/Navigation/Header/AppIcon";

interface RouteError {
  status?: number;
  statusText?: string;
  error?: string;
}

const ErrorPage = () => {
  const routeError = useRouteError() as RouteError;

  console.log(routeError);
  return (
    <section className="mt-[20vh] p-4 h-full w-full">
      <div className="text-center flex flex-col space-y-4">
        <AppIcon />
        <h1>{`${routeError.status ?? "Unknown"} ${routeError.statusText ?? "Error"}`}</h1>
        <p className="my-8 opacity-65">{`${routeError.error ?? "An unexpected error occurred."}`}</p>
      </div>
    </section>
  );
};

export default ErrorPage;
