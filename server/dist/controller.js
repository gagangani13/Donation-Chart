"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donations = exports.addAmount = void 0;
const model_1 = require("./model");
const addAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { place, amount, date } = req.body;
    if (!place || !amount || !date) {
        throw new Error();
    }
    const addAmount = new model_1.Donation({
        place,
        amount,
        date,
    });
    const saveAmount = yield addAmount.save();
    try {
        res.send({ ok: true, content: saveAmount });
    }
    catch (error) {
        res.send({ ok: false, error: "Failed to add amount" });
    }
});
exports.addAmount = addAmount;
const donations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const year = req.query.year;
    const month = req.query.month;
    const uniqueYearsResult = yield model_1.Donation.aggregate([
        {
            $project: {
                year: { $year: "$date" },
            },
        },
        {
            $group: {
                _id: "$year",
            },
        },
        { $sort: { _id: -1 } },
    ]);
    const uniqueYearsArray = [...uniqueYearsResult.map((result) => result._id)];
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    if (year &&
        uniqueYearsArray.includes(Number(year)) &&
        typeof month === "string" &&
        monthNames.includes(month)) {
        const monthIndex = monthNames.indexOf(month) + 1;
        const startDate = new Date(Number(year), monthIndex - 1, 1);
        const endDate = new Date(Number(year), monthIndex, 0);
        const dataResult = yield model_1.Donation.aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: { date: "$date", place: "$place" },
                    amount: { $sum: "$amount" },
                },
            },
        ]);
        const uniqueDatesSet = new Set(dataResult.map((data) => data._id.date.getTime()));
        const xAxisArray = Array.from(uniqueDatesSet).map((time) => new Date(time));
        const bangaloreArray = fillZeroesForPlace("Bangalore", xAxisArray, dataResult);
        const sataraArray = fillZeroesForPlace("Satara", xAxisArray, dataResult);
        const hyderabadArray = fillZeroesForPlace("Hyderabad", xAxisArray, dataResult);
        const monthsData = yield model_1.Donation.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(Number(year), 0, 1),
                        $lte: new Date(Number(year), 11, 31),
                    },
                },
            },
            {
                $group: {
                    _id: { month: { $month: "$date" } },
                    totalAmount: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const monthsArray = monthsData
            .filter((data) => data.totalAmount !== 0)
            .map((data) => monthNames[data._id.month - 1]);
        function fillZeroesForPlace(placeName, datesArray, dataResult) {
            const amountByDateAndPlace = new Map(dataResult
                .filter((data) => data._id.place === placeName)
                .map((data) => [data._id.date.getTime(), data.amount]));
            return datesArray.map((date) => {
                const amount = amountByDateAndPlace.get(date.getTime());
                return amount !== undefined ? amount : 0;
            });
        }
        try {
            res.send({
                ok: true,
                xAxisArray: xAxisArray.map((day) => monthNames[new Date(day).getMonth()] + " " + new Date(day).getDate()),
                bangaloreArray,
                sataraArray,
                hyderabadArray,
                uniqueYearsArray,
                monthsArray,
                year,
                month,
            });
        }
        catch (error) {
            res.send({ ok: false, error: "Failed to fetch!!" });
        }
    }
    else if (year &&
        uniqueYearsArray.includes(Number(year)) &&
        month &&
        !monthNames.includes(month)) {
        const dataResult = yield model_1.Donation.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $year: "$date" }, Number(year)],
                    },
                },
            },
            {
                $project: {
                    month: { $month: "$date" },
                    place: 1,
                    amount: 1,
                },
            },
            {
                $group: {
                    _id: { month: "$month", place: "$place" },
                    totalAmount: { $sum: "$amount" },
                },
            },
            {
                $group: {
                    _id: "$_id.month",
                    places: {
                        $push: {
                            place: "$_id.place",
                            totalAmount: "$totalAmount",
                        },
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const bangaloreArray = Array(12).fill(0);
        const sataraArray = Array(12).fill(0);
        const hyderabadArray = Array(12).fill(0);
        dataResult.forEach((result) => {
            const monthIndex = result._id - 1;
            result.places.forEach((placeData) => {
                if (placeData.place === "Bangalore") {
                    bangaloreArray[monthIndex] = placeData.totalAmount;
                }
                else if (placeData.place === "Satara") {
                    sataraArray[monthIndex] = placeData.totalAmount;
                }
                else if (placeData.place === "Hyderabad") {
                    hyderabadArray[monthIndex] = placeData.totalAmount;
                }
            });
        });
        try {
            res.send({
                ok: true,
                xAxisArray: monthNames.filter((_, idx) => bangaloreArray[idx] || sataraArray[idx] || hyderabadArray[idx]),
                bangaloreArray: bangaloreArray.filter((_, idx) => bangaloreArray[idx] || sataraArray[idx] || hyderabadArray[idx]),
                sataraArray: sataraArray.filter((_, idx) => bangaloreArray[idx] || sataraArray[idx] || hyderabadArray[idx]),
                hyderabadArray: hyderabadArray.filter((_, idx) => bangaloreArray[idx] || sataraArray[idx] || hyderabadArray[idx]),
                uniqueYearsArray,
                monthsArray: monthNames.filter((_, idx) => bangaloreArray[idx] || sataraArray[idx] || hyderabadArray[idx]),
                year,
                month: "Month",
            });
        }
        catch (error) {
            res.send({ ok: false, error: "Failed to fetch" });
        }
    }
    else {
        const dataResult = yield model_1.Donation.aggregate([
            {
                $project: {
                    year: { $year: "$date" },
                    place: 1,
                    amount: 1,
                },
            },
            {
                $group: {
                    _id: { year: "$year", place: "$place" },
                    totalAmount: { $sum: "$amount" },
                },
            },
            {
                $group: {
                    _id: "$_id.year",
                    places: {
                        $push: {
                            place: "$_id.place",
                            totalAmount: "$totalAmount",
                        },
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const xAxisArray = dataResult.map((result) => result._id);
        const fillZerosForPlace = (placeName) => {
            return dataResult.map((result) => {
                var _a;
                return ((_a = result.places.find((placeData) => placeData.place === placeName)) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0;
            });
        };
        const bangaloreArray = fillZerosForPlace("Bangalore");
        const sataraArray = fillZerosForPlace("Satara");
        const hyderabadArray = fillZerosForPlace("Hyderabad");
        try {
            res.send({
                ok: true,
                xAxisArray,
                bangaloreArray,
                sataraArray,
                hyderabadArray,
                uniqueYearsArray,
                monthsArray: [],
                year: "Year",
                month: "Month",
            });
        }
        catch (error) {
            res.send({ ok: false, error: "Failed to fetch!!" });
        }
    }
});
exports.donations = donations;
