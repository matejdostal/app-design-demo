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
};

const tripStateValue = {
    idle : "IDLE",
    on_the_way : "HEADING_TO_NEXT_STATION",
    departure : "DEPARTURE",
    arrival : "ARRIVAL",
    none : null
};

const stateValue = {
    meskanie: "Meskanie o: ",
    nadbieha: "Nadbieha o: ",
    none: ""
};

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
        <img className="vehicle-icon flex-shrink-0 mx-1" src={icon}/>
    );
}

const typeBadge = (vehicle) => {
    const transType = translateType(vehicle.vehicle_type)
    let text, extraClasses;
    switch (vehicle.trip_status) {
        case tripStateValue.on_the_way:
            text = (vehicle) => {
            
                return (
                    <>
                        <span className="flex-grow-1">
                            {
                                vehicle.line_name + " : " + 
                                vehicle.current_stop_name + " 🠖 " + 
                                vehicle.destination_stop_name
                            }
                        </span>
                    </>
                );
            };
            extraClasses = " trip-on-way ";
            break;
        case tripStateValue.arrival:
            text = (vehicle) => {
                return (
                    <>
                        <span className="flex-grow-1">
                            {
                                vehicle.line_name + " : " + vehicle.current_stop_name + " 🠖 " + vehicle.destination_stop_name
                            }
                        </span>
                        <div className="vehicle-trip-arrival vehicle-trip-icon flex-shrink-0">
                            <img src="icons/arrival.svg"/>
                        </div>
                    </>
                );
            }
            extraClasses = " trip-arrival ";
            break;
        case tripStateValue.departure:
            text = (vehicle) => {
                return (
                    <>
                        <span className="flex-grow-1">
                            {
                                vehicle.line_name + " : " + vehicle.current_stop_name + " 🠖 " + "NEXT_STOP"
                            }
                        </span>
                        <div className="vehicle-trip-departure vehicle-trip-icon flex-shrink-0">
                            <img src="icons/departure.svg"/>
                        </div>
                    </>
                );
            }
            extraClasses = " trip-departure ";
            break;
        case tripStateValue.idle:
            text = (vehicle) => {
                return (
                    <>
                        <span className="flex-grow-1">
                            {
                                vehicle.line_name + " : " + vehicle.current_stop_name
                            }
                        </span>
                        <div className="vehicle-trip-idle vehicle-trip-icon flex-shrink-0">
                            <img src="icons/idle.svg"/>
                        </div>
                    </>
                );
            }
            extraClasses = " trip-idle ";
            break;
        default:
            text = (vehicle) => {
                return (
                    <>
                        <span className="flex-grow-1">
                            {
                                "Nie je pripojeny do databazy"
                            }
                        </span>
                        <div className="vehicle-trip-null vehicle-trip-icon flex-shrink-0">
                            <img src="icons/unknown-trip-state.svg"/>
                        </div>
                    </>
                );
            }
            extraClasses = " trip-null ";
            break;
    }

    return (
        <div className={"vehicle-link-status d-flex bg-opacity-10 border border-1 shadow-sm rounded-3 px-1 mx-1 fs-6 text-wrap" + extraClasses}>
            {
                iconType(transType)
            }
            <div className="vehicle-type-text flex-grow-1 d-flex">
            {
                text(vehicle)
            }
            </div>
        </div>
    );
}
/**
 * A function that parses an "HH:mm:ss" formatted
 * time given in string into an integer that represents
 * the sum of the given time in seconds.
 * @param {String} timestring 
 * @returns {Int} the time in seconds
 */
const parseTime = (timestring) => {
    if (timestring === undefined || timestring === null) return undefined;
    let time = timestring.match( /(-?[0-9][0-9]:[0-9][0-9]:[0-9][0-9])/g );
    if (time !== null) {
        // a timestring containing 2 times is not possible/ it's neglibable to just not parse them
        if (time.length > 1) return ErrorEvent;

        const s = time.toString().match(/[-]/g); // find negative symbol
        const g = time.toString().split(':');
        g.forEach( (element, index, parsed) => {
            parsed[index] = parseInt(element);
        });

        if (s === null) {
            return ((g[0]*3600) + (g[1]*60) + (g[2]));
        }
        else {
            return (((g[0]*3600) + (g[1]*60) + (g[2])) * (-1));
        }
    }

    return undefined;
}
/**
 * Parses the given string and returns the absolute value of `timestring` if `timestring` is a time given in the format of **HH:mm:ss**
 * @param {String} timestring 
 * @returns {String} `String`
 */
const timeAbsString = (timestring) => {
    if (timestring === undefined || timestring === null) return undefined;

    let time = timestring.match( /(-?[0-9][0-9]:[0-9][0-9]:[0-9][0-9])/g );
    if (time !== null) {
        if (time.length > 1) return ErrorEvent;

        const s = time.toString().match(/[-]/g); // find negative symbol
        
        if (s === null) {
            return time.toString();
        }
        else {
            // znamienko je s[0]
            console.log(s[0] + " www " + s[1])
            return s[1];
        }
    }
    return undefined;
}

/**
 * **3 possible values**:  
 * `0` - `early`  
 * `1` - `late`  
 * `2` - `neither`
 * @param {Vehicle} vehicle 
 * @returns {Int} `seconds`
 */
const timeDifference = (vehicle) => {
    const td = parseTime(TimeDifferenceNeededForLate);
    const time_difference = parseTime(vehicle.time_difference);
    
    if (time_difference > 0 && time_difference > td) {
        return 0;
    }
    else if (time_difference < 0 && time_difference < -td) {
        return 1;
    }
    else {
        return 2;
    }
}

/**
 * Returns background color type (for `class` html tag).  
 * 
 * The colors for the particular string are beforehand declared in CSS.
 * @param {Object} vehicle 
 * @returns {String} `string`
 */
const IconBackground = (vehicle) => {
    const isOnline = vehicle.online;

    switch (timeDifference(vehicle)) {
        case 0:
            return ("bg-vehicle-early ");
        case 1:
            return ("bg-vehicle-late ");
        case 2:
            return ("bg-vehicle-okay ");
    }
}

const timeDifferenceBadge = (vehicle) => {

    let m,txt;
    switch (timeDifference(vehicle)) {
        case 0:
            m = "td-nadbieha ";
            txt = (stateValue.nadbieha + vehicle.time_difference);
            break;
        case 1:
            m = "td-meskanie ";
            txt = (stateValue.meskanie + vehicle.time_difference);
            break;
        case 2:
            m = "hidden ";
            txt = ""
            break;
    }
    return (
        <div className={m + "badge d-flex justify-content-end"}>         
            <span className="td-text">{
                txt
            }
            </span>
        </div>
    );
}

const vehicleInformation = (vehicle) => {
    if (vehicle.service_number !== null)
    {
        return (
            <>
                <div className="">
                    {
                        vehicle.line_name +" "+ vehicle.current_stop_name
                    }
                </div>
                {
                    timeDifferenceBadge(vehicle)
                }
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
                else if (vehicle.online === false) {
                    dostupny = " bg-offline "
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

const header = ReactDOM.createRoot(document.getElementById("header-part"))
const root = ReactDOM.createRoot(document.getElementById("root"));
header.render(<CreateHeader />)
root.render(<ConatinerData />)
