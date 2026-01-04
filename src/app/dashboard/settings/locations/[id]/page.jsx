import { LocationView } from "../../../../../routes/Dashboard/Settings/Locations/view";

export default function LocationViewPage({ params }) {
  return <LocationView locationId={params.id} />;
}

export const metadata = {
  title: 'Location • Nevios',
};

