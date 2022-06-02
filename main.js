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

const TimeDifferenceNeededForLate = "00:01:00";

/***************************************************************************************/
/*                                                                                     */
/***************************************************************************************/

const formatDate = (date) => {
    return (date);
}

const iconType = (vehicle_type) =>{
    let icon;
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
                text
            }
            </span>
        </div>
    );
}
/**
 * A function that parses an "HH:mm:ss" formatted
 * time given in string into an integer that represents
 * the sum of the given time in seconds.
 * @param {string} timestring 
 * @returns {int} the time in seconds
 */
const parseTime = (timestring) => {
    if (timestring === undefined || timestring === null) return undefined;
    let time = timestring.match( /(-?[0-9][0-9]:[0-9][0-9]:[0-9][0-9])/g );
    if (time !== null) {
        // a timestring containing 2 times is not possible/ it's neglibable to just not parse them
        if (time.length > 1) return ErrorEvent;

        const s = time.toString().match(/[-]/g);
        const g = time.toString().split(':');
        if (s === null) {
            return ((g[0]*3600) + (g[1]*60) + (g[2]));
        }
        else {
            return (((g[0]*3600) + (g[1]*60) + (g[2])) * (-1));
        }
    }

    return 1;
}

/**
 * Returns background color type (for `class` html tag).  
 * 
 * The colors for the particular string are beforehand declared in CSS.
 * @param {Object} vehicle 
 * @returns {string}  background type
 */
const IconBackground = (vehicle) => {
    const isOnline = vehicle.online;

    // I don't know why this doesn't work, it should theoretically work
    if ((vehicle.errors != null) && vehicle.errors[0] !== undefined) {
        return ("bg-vehicle-error ");
    }
    else if (isOnline == false) {
        return ("bg-vehicle-offline ");
    }
    else if (isOnline == true && vehicle.time_difference !== null) {
        // TODO: not working properly, at least in my head
        if (parseTime(vehicle.time_difference) > parseTime(TimeDifferenceNeededForLate)) {
            return ("bg-vehicle-early ");
        }
        else if (parseTime(vehicle.time_difference) < (parseTime(TimeDifferenceNeededForLate))) {
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

const MayShowInfo = (vehicle) => {
    const state = parseTime(vehicle.time_difference);
    if (state > parseTime(TimeDifferenceNeededForLate)) {
        let meska = (vehicle) => {
            return (
                <span className="meskanie">
                    {vehicle.time_difference}
                </span>
            );
        }
    }
    else if (state < (parseTime(TimeDifferenceNeededForLate))) {
        let skoro = (vehicle) => {
            return (
                <span className="skoro">
                    {vehicle.time_difference}
                </span>
            );
        }
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
                    {
                        MayShowInfo(vehicle)
                    }
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
