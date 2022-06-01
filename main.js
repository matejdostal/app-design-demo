const { useState, useEffect } = React;

/****************************************************************************************/
/*     Header - just for looks, so I know what it will probably look like normally      */
/****************************************************************************************/
const CreateHeader = () => {
    return (
        <header className="overflow-hidden">
            <nav className="bg-dark text-white navbar navbar-expand-lg">
                <div className="container-fluid justify-content-center">
                    <div className="searchbox p-2 nav-item">
                        <div class="form-outline" id="search-auto">
                            <input id="search-input" type="search" class="form-control" placeholder="Hladať" />
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

const CheckIfHeaderVisible = (prevValue) => {
    const navbar_element = document.getElementById('navbar');
    let scrollvalue = window.pageYOffset;
    if (scrollvalue < prevValue) {
        navbar_element.hidden = false;
    }
    else {
        prevValue = window.pageYOffset;
        if (navbar_element.hidden == false) {
            navbar_element.hidden = true;
        }
    }
}

/****************************************************************************************/
/*                                  CONSTANTS TO CHANGE                                 */
/****************************************************************************************/
const VehicleTypes = {
    bus: "Autobus",
    trolleybus: "Trolejbus",
    train: "Vlak",
    unknown: "Neznámy"
};

const VehicleTypesIcons = {
    bus: "icons/bus.svg",
    trolleybus: "icons/trolley.svg",
    train: "icons/train.svg",
    unknown: "icons/unknown.svg"
};

const translateType = (vehicle_type) => {
    switch (vehicle_type) {
        case "bus":
            return VehicleTypes.bus;
        case "trolleybus":
            return VehicleTypes.trolleybus;
        case "train":
            return VehicleTypes.train;
        default:
            return VehicleTypes.unknown;
    }
}

/***************************************************************************************/
/*                                                                                     */
/***************************************************************************************/

const formatDate = (date) => {
    return (date);
}

const iconType = (vehicle_type) =>{
    let icon = "";
    switch (vehicle_type) {
        case VehicleTypes.bus:
            icon = VehicleTypesIcons.bus;
            break;
        case VehicleTypes.trolleybus:
            icon = VehicleTypesIcons.trolleybus;
            break;
        case VehicleTypes.train:
            icon = VehicleTypesIcons.train;
            break;
        default:
            icon = VehicleTypesIcons.unknown;
            break;
    }
    return (
        <img className="vehicle-icon mx-1" src={icon}/>
    );
}

const typeBadge = (vehicle) => {
    const transType = translateType(vehicle.vehicle_type)
    let text;
    if (vehicle.line_name === null) {
        text = "Nedostupný";
    }
    else {
        text = vehicle.line_name + " : " + vehicle.current_stop_name;
    }
    return (
        <div className={"vehicle-type bg-success text-dark bg-opacity-10 border border-1 shadow-md rounded-2 px-1 fs-6 text-wrap"}>
            {iconType(transType)}
            <span className="vehicle-type-text">
            {
                    vehicle.service_number + 
                    " - " + 
                    transType
                }
                </span>
            </div>
        );
    }
}

const ParseTime = (timestring) => {
    const d = new Date(timestring);
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();

    return ((h*3600) + (m*60) + (s));
}

const IconBackground = (vehicle) => {
    const isOnline = vehicle.online;

    if (vehicle.errors != null && vehicle.errors.lenght > 0) {
        return ("bg-vehicle-error ");
    }
    else if (isOnline == false) {
        return ("bg-vehicle-offline ");
    }
    else if (isOnline == true && vehicle.time_difference !== null) {
        if (ParseTime(vehicle.time_difference) > ParseTime("00:01:00")) {
            return ("bg-vehicle-late ");
        }
        else {
            return ("bg-vehicle-online ");
        }
    }
    else {
        return ("bg-vehicle-online ");
    }
}

const vehicleInformation = (vehicle) => {
    if (vehicle.service_number !== null)
    {
        return (
            <>
                <div className="">
                    {vehicle.line_name +" "+ vehicle.current_stop_name}
                </div>
                <div className="">
                    {}
                </div>
            </>
        );
    }
}

const ConatinerData = () => {
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
        <div className="container-fluid dataroot ">
            {vehicles.map((vehicle) => {
                //const fDate = formatDate(vehicle.state_dtime);
                let dostupny = "";
                if (vehicle.line_name === null) {
                    dostupny = " bg-unavailable ";
                }
                return (
                    <a id={vehicle.vehicle_number} key={vehicle.vehicle_number} href={"#" + vehicle.vehicle_number} className={"d-flex border border-1 shadow-sm rounded-3 align-items-center m-2 my-3 p-3 item" + dostupny}>
                        <div className="p-2 m-2 me-3 vehicle-number">
                            <div className={
                                IconBackground(vehicle) + 
                                "badge text-center vehicle-number-text fs-6 "
                            } >{vehicle.vehicle_number}</div>
                        </div>
                        <div className=" flex-fill item-info">
                            <div className="">
                                {typeBadge(vehicle)}
                                <div className="">
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                {vehicleInformation(vehicle)}
                            </div>
                        </div>
                    </a>
                );
        })}
       </div>
    );
}
   
const App = () => {
    return (
        <>
            {CreateHeader()}
            {ConatinerData()}
        </>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
