const { useState, useEffect } = React;

const formatDate = (date) => {
    return "--" + date;
};

const App = () => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        fetch("data.json")
            .then((response) => response.json())
            .then((vehicles) => {
                console.log(vehicles);
                setVehicles(vehicles);
            });
    }, []);

    return (
        <div className="container">
            {vehicles.map((vehicle) => {
                const fDate = formatDate(vehicle.state_dtime);
                return (
                    <div key={vehicle.vehicle_number} className="item">
                        <div className="vehicle-number">{vehicle.vehicle_number}</div>
                        <div>{vehicle.current_stop_name}</div>
                        <div>{fDate}</div>
                    </div>
                );
            })}
        </div>
    );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
