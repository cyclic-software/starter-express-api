import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, Fab, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  calendarColor,
  primartColorWithOpacity,
  primaryColor,
  secondaryColor,
  secondaryColorNoOpacity,
} from "../../../../constants/colors";
import { weekDays, getDaysByDate, months } from "../../../../utils/dates_util";
import { useUserContext } from "../../../../components/contexts/user_context_provider";
import { getAppointments } from "../../../../controllers/appointments_controller";

const MyCalendar = ({
  reload,
  selectedDay,
  selectedMonth,
  selectedYear,
  setSelectedDay,
  setSelectedMonth,
  setSelectedYear,
}) => {
  const { token } = useUserContext();
  const [year, setYear] = useState(new Date(Date.now()).getFullYear());
  const [month, setMonth] = useState(new Date(Date.now()).getMonth());

  const [monthDays, setMonthDays] = useState([]);

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadAppointments = async () => {
      var response = await getAppointments(token);
      if (response.status === "OK") {
        setAppointments(response.data);
      }
    };

    loadAppointments();

    return () => {};
  }, [reload]);

  useEffect(() => {
    const monthDays = getDaysByDate(year, month);
    setMonthDays(monthDays);
  }, [year, month]);

  const reset = () => {
    var date = new Date(Date.now());
    setYear(date.getFullYear());
    setMonth(date.getMonth());
    setSelectedDay(date.getDate());
    setSelectedMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
  };

  const prevMonth = () => {
    if (month === 0) {
      setYear((year) => year - 1);
      setMonth((month) => 11);
    } else {
      setMonth((month) => month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear((year) => year + 1);
      setMonth((month) => 0);
    } else {
      setMonth((month) => month + 1);
    }
  };

  if (monthDays.length === 0) return <></>;

  return (
    <Grid container>
      <Grid item container xs={12} justifyContent="space-between" height={"100%"}>
        <Grid item>
          <Typography variant="h3" style={{ fontWeight: "bold" }}>
            {`${months[month]} ${year}`}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={reset}
            variant="contained"
            style={{ color: "white", backgroundColor: secondaryColor, fontWeight: "bold" }}
          >
            Today
          </Button>
          <IconButton color="black" onClick={prevMonth}>
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton color="black" onClick={nextMonth}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ height: "20px" }} />
      <Grid item container xs={12} justifyContent="space-between">
        {weekDays.map((day) => {
          return (
            <Grid
              key={`day_header_${day}`}
              item
              xs={11 / weekDays.length}
              style={{
                backgroundColor: "white",
                color: secondaryColor,
                padding: 5,
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                borderRadius: 5,
              }}
            >
              {day}
            </Grid>
          );
        })}
      </Grid>
      <Grid item xs={12} style={{ height: "20px" }} />
      <Grid item container xs={12} justifyContent="space-between">
        {monthDays.map((dayObj) => {
          return (
            <Grid
              key={`day_grid_${JSON.stringify(dayObj)}_${Date.now()}`}
              item
              xs={11 / weekDays.length}
              marginBottom={5}
            >
              <Day
                key={`day_value_${dayObj.day}`}
                dayObj={dayObj}
                isSelected={
                  selectedDay === dayObj.day && selectedMonth === dayObj.month && selectedYear === dayObj.year
                }
                setSelectedDay={setSelectedDay}
                setSelectedMonth={setSelectedMonth}
                setSelectedYear={setSelectedYear}
                appointments={appointments.filter(
                  (a) => a.date === `${dayObj.day}-${dayObj.month}-${dayObj.year}`
                )}
              />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

const Day = ({ dayObj, isSelected, setSelectedDay, setSelectedMonth, setSelectedYear, appointments }) => {
  console.log(appointments.length);

  return (
    <Grid
      onClick={() => {
        setSelectedDay(dayObj.day);
        setSelectedMonth(dayObj.month);
        setSelectedYear(dayObj.year);
      }}
      key={`day_component_${dayObj.day}`}
      container
      style={{
        height: "10vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isSelected
          ? "#9f79f3"
          : dayObj.sameDate
          ? calendarColor
          : primartColorWithOpacity("77"),
        borderRadius: 5,
        border: appointments.length === 0 ? "1px solid white" : "5px solid black",
      }}
    >
      <Typography variant="body2" style={{ color: "black", fontSize: 30, fontWeight: "bold" }}>
        {dayObj.day}
      </Typography>
    </Grid>
  );
};

export default MyCalendar;
