import React, { useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useCreateTournamentMutation } from 'src/types/graphql-generated';
import { DateTime } from 'luxon';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { MenuItem, Select } from '@mui/material';
import { DateTimeSchema } from 'src/utils/yup/DateTimeSchema';
import MenuBar from '../MenuBar/MenuBar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // flexGrow: 1,
    },
    left: {
      backgroundColor: 'black',
    },
    formBox: {
      marginTop: theme.spacing(10),
    },
    form: {
      padding: theme.spacing(5),
      textAlign: 'left',
    },
    formGrid: {
      margin: 'auto',
    },
    formTitle: {
      paddingBottom: theme.spacing(3),
      textAlign: 'center',
    },
    formButtons: {
      marginTop: theme.spacing(2),
    },
    textField: {
      width: '100%',
      marginBottom: theme.spacing(3),
    },
    nameFieldContainer: {
      width: '100%',
      display: 'flex',
      marginBottom: theme.spacing(3),
    },
    nameField: {
      flex: '1 1 auto',
    },
    nameFieldSuffix: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(2),
    },
    dateField: {
      width: '100%',
      marginBottom: theme.spacing(3),
    },
    createButton: {
      marginTop: theme.spacing(2),
      width: '100%',
    },
    errorText: {
      color: theme.palette.error.main,
    },
    startOptionsContainer: {
      display: 'flex',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    startOptionsLabel: {
      flex: '0 0 auto',
      display: 'inline-flex',
      alignItems: 'center',
    },
    startOptionsSelect: {
      marginLeft: theme.spacing(2),
      flex: '1 1 auto',
    },
  })
);

enum StartOptions {
  Now = 'now',
  Later = 'later',
}

interface Inputs {
  name: string;
  startOption: StartOptions;
  startDate: DateTime;
  lastRoundDate: DateTime;
  roundsNumber: number;
  minutesBetweenRounds: number;
}

const schema = yup
  .object()
  .shape({
    name: yup.string().max(15).min(5).required().label("Tournament's name"),
    startOption: yup
      .string()
      .required()
      .oneOf(Object.values(StartOptions))
      .label('Tournament start option'),
    startDate: new DateTimeSchema()
      .typeError('Invalid Date')
      .label('Start date')
      .when('startOption', (startOption: StartOptions, schema) => {
        if (startOption === StartOptions.Later.valueOf()) {
          return schema.defined().min(DateTime.now(), 'Start date cannot be in the past');
        }
        return schema;
      }),
    lastRoundDate: new DateTimeSchema()
      .required()
      .typeError('Invalid Date')
      .label("Last Round's date")
      // @ts-ignore yup.w hen's type is incorrect
      .when(['startOption', 'startDate'], (startOption, startDate, schema) => {
        let start = startDate;
        if (startOption === StartOptions.Now.valueOf()) {
          start = DateTime.now();
        }
        return schema.min(
          start,
          `last round date must be after tournament start date (${start.toLocaleString(
            DateTime.DATETIME_FULL
          )})`
        );
      }),
    roundsNumber: yup.number().required().integer().min(1).max(32).label('Number of rounds'),
    minutesBetweenRounds: yup.number().required().integer().min(15).label('Minutes between rounds'),
  })
  .test({
    name: 'scheduleIsValid',
    message: ({ value }) => {
      const firstRoundDate = DateTime.fromJSDate(value.lastRoundDate).minus({
        minutes: value.minutesBetweenRounds * (value.roundsNumber - 1),
      });
      return `With the provided schedule, the first round starts on ${firstRoundDate.toLocaleString(
        DateTime.DATETIME_FULL
      )}, which is exactly at or before the tournament start date.`;
    },
    test: (value) => {
      let start: DateTime;
      if (value.startOption === StartOptions.Now.valueOf()) {
        start = DateTime.now();
      } else {
        start = value.startDate;
      }
      const result =
        start <
        value.lastRoundDate.minus({
          minutes: value.minutesBetweenRounds * (value.roundsNumber - 1),
        });
      return result;
    },
  });

export default function TournamentCreationPage(props) {
  const classes = useStyles();
  const now = DateTime.now();
  const history = useHistory();

  const { register, handleSubmit, errors, control } = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      startOption: StartOptions.Now,
      startDate: now.plus({ hours: 1 }),
      lastRoundDate: now.plus({ hours: 4 }),
      roundsNumber: 9,
      minutesBetweenRounds: 15,
    },
  });

  const formState = useWatch<Inputs>({
    control,
  });

  const [firstRoundDate, setFirstRoundDate] = useState<DateTime>(undefined);
  const [validSchedule, setValidSchedule] = useState<boolean>(true);

  useEffect(() => {
    let start: DateTime;
    if (formState.startOption === StartOptions.Now.valueOf()) {
      start = DateTime.now();
    } else {
      start = formState.startDate as DateTime;
    }
    const firstRound = (formState.lastRoundDate as DateTime)?.minus({
      minutes: formState.minutesBetweenRounds * (formState.roundsNumber - 1),
    });
    setFirstRoundDate(firstRound);
    setValidSchedule(start < firstRound);
  }, [
    formState.startOption,
    formState.startDate,
    formState.lastRoundDate,
    formState.roundsNumber,
    formState.minutesBetweenRounds,
  ]);

  const [createTournament] = useCreateTournamentMutation({
    onCompleted: (data) => {
      history.replace(`/tournament/${data.createTournament.id}/info`);
    },
  });

  const onSubmit = async (data: Inputs) => {
    const variables = { ...data };
    if (data.startOption === StartOptions.Now.valueOf()) {
      variables.startDate = DateTime.now();
    }
    createTournament({
      variables,
    });
  };

  return <>
    <MenuBar showTournaments={true} />
    <div className={classes.root}>
      <Grid container xs={12} spacing={3} direction="row" justifyContent="center">
        <Grid item xs={4}>
          <Paper className={classes.formBox} elevation={3}>
            <form
              className={classes.form}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Typography className={classes.formTitle} variant="h4" component="h2" gutterBottom>
                Create a tournament
              </Typography>
              <div className={classes.nameFieldContainer}>
                <TextField
                  inputRef={register}
                  label="Name"
                  name="name"
                  variant="outlined"
                  error={errors?.name !== undefined}
                  helperText={errors?.name?.message}
                  className={classes.nameField}
                />
                <Typography variant="body1" className={classes.nameFieldSuffix}>
                  Tournament
                </Typography>
              </div>

              <div className={classes.startOptionsContainer}>
                <Typography
                  id="tournament-start-select-label"
                  className={classes.startOptionsLabel}
                  variant="body1"
                >
                  Start Tournament
                </Typography>
                <Controller
                  name="startOption"
                  control={control}
                  render={({ ref, ...rest }) => (
                    <Select
                      labelId="tournament-start-select-label"
                      className={classes.startOptionsSelect}
                      {...rest}
                      variant="outlined"
                    >
                      {Object.values(StartOptions).map((startOpt) => (
                        <MenuItem value={startOpt} key={startOpt}>
                          {startOpt}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
              {formState.startOption === StartOptions.Later && (
                <Controller
                  name="startDate"
                  control={control}
                  render={({ ref, ...rest }) => (
                    <DateTimePicker
                      label="Start Date"
                      animateYearScrolling
                      invalidDateMessage="Invalid Date"
                      views={['year', 'month', 'date', 'hours', 'minutes']}
                      cancelLabel="Cancel"
                      openTo="hours"
                      {...rest}
                      inputVariant="outlined"
                      className={classes.dateField}
                      error={errors?.startDate !== undefined || !validSchedule}
                      helperText={errors?.startDate && errors?.startDate.message}
                    />
                  )}
                />
              )}
              <Controller
                name="lastRoundDate"
                control={control}
                render={({ ref, ...rest }) => (
                  <DateTimePicker
                    label="Last Round Date"
                    animateYearScrolling
                    invalidDateMessage="Invalid Date"
                    views={['year', 'month', 'date', 'hours', 'minutes']}
                    cancelLabel="Cancel"
                    openTo="hours"
                    {...rest}
                    inputVariant="outlined"
                    className={classes.dateField}
                    error={errors?.lastRoundDate !== undefined || !validSchedule}
                    helperText={errors?.lastRoundDate && errors?.lastRoundDate.message}
                  />
                )}
              />
              <TextField
                inputRef={register}
                type="number"
                label="Number of Rounds"
                name="roundsNumber"
                variant="outlined"
                error={errors?.roundsNumber !== undefined || !validSchedule}
                helperText={errors?.roundsNumber?.message}
                className={classes.textField}
              />
              <TextField
                inputRef={register}
                type="number"
                label="Minutes between rounds"
                name="minutesBetweenRounds"
                variant="outlined"
                error={errors?.minutesBetweenRounds !== undefined || !validSchedule}
                helperText={errors?.minutesBetweenRounds?.message}
                className={classes.textField}
              />
              <div>
                <Typography variant="body1" className={!validSchedule && classes.errorText}>
                  With this schedule the first round will be on{' '}
                  {firstRoundDate?.toLocaleString(DateTime.DATETIME_FULL)}.
                  {!validSchedule &&
                    ' The first round should be after the tournament start date.'}
                </Typography>
              </div>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className={classes.createButton}
              >
                Create
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  </>;
}
