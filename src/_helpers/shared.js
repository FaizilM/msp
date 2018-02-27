/*
* TimeFilter aggregation across application
*/

export function getValueByTime(
    value,
    typeBy
) {
    let response = 0;
    if (value && typeBy) {
        if (value == 0) {
            value = 1;
        }
        switch (typeBy) {
            case "DAY":
                response = value * 24;
                break;
            case "WEEK":
                response = value * (24 * 7) - 24;
                break;
            case "MONTH":
                response = value * (24 * 30) - 24;
                break;
            case "YEAR":
                response = value * (24 * 366) - 24;
                break;
            default:
                response = value;
        }
    }
    console.log("typeBy --> " + typeBy + ": " + response);
    return response;
}

export function getSiteByTime(
    typeBy
) {
    let response = [];
    if (typeBy) {
        switch (typeBy) {
            case "DAY":
                response = [9, 2, 1];
                break;
            case "WEEK":
                response = [8, 3, 1];
                break;
            case "MONTH":
                response = [8, 3, 1];
                break;
            case "YEAR":
                response = [7, 4, 1];
                break;
            default:
                response = [9, 2, 1];
        }
    }
    console.log("typeBy --> " + typeBy + ": " + response);
    return response;
}

export function getKPIDataByPercentage(
    value,
    typeBy
) {
    if (value == 0) {
        value = 1;
    }
    let response = [];
    if (typeBy && value) {
        switch (typeBy) {
            case "DAY":
                response = (value * 24) / 100;
                break;
            case "WEEK":
                response = (((value * 24) * 7) / 100) - 24;
                break;
            case "MONTH":
                response = (((((value * 24) * 7) / 100) * 30) / 100);
                break;
            case "YEAR":
                response = (((value * 24) / 100) * 365) / 100;
                // response = ((((((value * 24) * 7) / 100) * 30) / 100) * 365) / 100 - 24;
                break;
            default:
                response = (value * 24) / 100;
        }
    }
    console.log("typeBy --> " + typeBy + ": " + response);
    return response;
}