import { Request, Response } from "express";
import { Donation } from "./model";
import excelJS from 'exceljs'
export const addAmount = async (req: Request, res: Response) => {
  const { place, amount, date } = req.body;
  if (!place || !amount || !date) {
    throw new Error();
  }
  const addAmount = new Donation({
    place,
    amount,
    date,
  });
  const saveAmount = await addAmount.save();
  try {
    res.send({ ok: true, content: saveAmount });
  } catch (error) {
    res.send({ ok: false, error: "Failed to add amount" });
  }
};
export const donations = async (req: Request, res: Response) => {
  const year = req.query.year;
  const month = req.query.month as string;
  const uniqueYearsResult = await Donation.aggregate([
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

  if (
    year &&
    uniqueYearsArray.includes(Number(year)) &&
    typeof month === "string" &&
    monthNames.includes(month)
  ) {
    const monthIndex = monthNames.indexOf(month) + 1;

    const startDate = new Date(Number(year), monthIndex - 1, 1);
    const endDate = new Date(Number(year), monthIndex, 0);

    const dataResult = await Donation.aggregate([
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

    const uniqueDatesSet = new Set(
      dataResult.map((data) => data._id.date.getTime())
    );
  
    const xAxisArray = Array.from(uniqueDatesSet).map((time) => new Date(time));
    const bangaloreArray = fillZeroesForPlace(
      "Bangalore",
      xAxisArray,
      dataResult
    );
    const sataraArray = fillZeroesForPlace("Satara", xAxisArray, dataResult);
    const hyderabadArray = fillZeroesForPlace(
      "Hyderabad",
      xAxisArray,
      dataResult
    );

    const monthsData = await Donation.aggregate([
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
      }
    ]);

    const monthsArray = monthsData
      .filter((data) => data.totalAmount !== 0)
      .map((data) => monthNames[data._id.month - 1]);
    function fillZeroesForPlace(
      placeName: any,
      datesArray: any,
      dataResult: any
    ) {
      const amountByDateAndPlace = new Map(
        dataResult
          .filter((data: any) => data._id.place === placeName)
          .map((data: any) => [data._id.date.getTime(), data.amount])
      );

      return datesArray.map((date: any) => {
        const amount = amountByDateAndPlace.get(date.getTime());
        return amount !== undefined ? amount : 0;
      });
    }
    xAxisArray.sort((a, b) => a.getTime() - b.getTime()); 
    try {
      res.send({
        ok: true,
        xAxisArray: xAxisArray.map(
          (day) =>
            monthNames[new Date(day).getMonth()] + " " + new Date(day).getDate()
        ),
        bangaloreArray,
        sataraArray,
        hyderabadArray,
        uniqueYearsArray,
        monthsArray,
        year,
        month
      });
    } catch (error) {
      res.send({ ok: false, error: "Failed to fetch!!" });
    }
  } else if (
    year &&
    uniqueYearsArray.includes(Number(year)) &&
    month &&
    !monthNames.includes(month)
  ) {
    const dataResult = await Donation.aggregate([
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
    const bangaloreArray: number[] = Array(12).fill(0);
    const sataraArray: number[] = Array(12).fill(0);
    const hyderabadArray: number[] = Array(12).fill(0);
    dataResult.forEach((result) => {
      const monthIndex = result._id - 1;
      result.places.forEach((placeData: any) => {
        if (placeData.place === "Bangalore") {
          bangaloreArray[monthIndex] = placeData.totalAmount;
        } else if (placeData.place === "Satara") {
          sataraArray[monthIndex] = placeData.totalAmount;
        } else if (placeData.place === "Hyderabad") {
          hyderabadArray[monthIndex] = placeData.totalAmount;
        }
      });
    });
    try {
      res.send({
        ok: true,
        xAxisArray: monthNames.filter(
          (_, idx) =>
            bangaloreArray[idx] || sataraArray[idx] || hyderabadArray[idx]
        ),
        bangaloreArray: bangaloreArray.filter(
          (_, idx) =>
            bangaloreArray[idx] || sataraArray[idx] || hyderabadArray[idx]
        ),
        sataraArray: sataraArray.filter(
          (_, idx) =>
            bangaloreArray[idx] || sataraArray[idx] || hyderabadArray[idx]
        ),
        hyderabadArray: hyderabadArray.filter(
          (_, idx) =>
            bangaloreArray[idx] || sataraArray[idx] || hyderabadArray[idx]
        ),
        uniqueYearsArray,
        monthsArray: monthNames.filter(
          (_, idx) =>
            bangaloreArray[idx] || sataraArray[idx] || hyderabadArray[idx]
        ),
        year,
        month: "Month",
      });
    } catch (error) {
      res.send({ ok: false, error: "Failed to fetch" });
    }
  } else {
    const dataResult = await Donation.aggregate([
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

    const fillZerosForPlace = (placeName: any) => {
      return dataResult.map(
        (result) =>
          result.places.find((placeData: any) => placeData.place === placeName)
            ?.totalAmount || 0
      );
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
    } catch (error) {
      res.send({ ok: false, error: "Failed to fetch!!" });
    }
  }
};
export const download = async (req: Request, res: Response) => {
  try {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Donations");
    worksheet.columns = [
      { header: "SL.NO", key: "slNo" },
      { header: "Amount", key: "amount" },
      { header: "Place", key: "place" },
      { header: "Date", key: "date" },
    ];

    const getDonations = await Donation.find({}).sort({ date: -1 });
    const dataWithSlNo = getDonations.map((data, index) => ({
      ...data.toJSON(),
      slNo: index + 1,
    }));

    dataWithSlNo.forEach((data) => {
      worksheet.addRow(data);
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=Donations.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.send({ ok: false, error: "Download Failed!" });
  }
};
