/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Route } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function RouteCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    date: "",
    departTime: "",
    lat: "",
    lng: "",
    driver: "",
    helper: "",
    route: "",
    status: "",
  };
  const [date, setDate] = React.useState(initialValues.date);
  const [departTime, setDepartTime] = React.useState(initialValues.departTime);
  const [lat, setLat] = React.useState(initialValues.lat);
  const [lng, setLng] = React.useState(initialValues.lng);
  const [driver, setDriver] = React.useState(initialValues.driver);
  const [helper, setHelper] = React.useState(initialValues.helper);
  const [route, setRoute] = React.useState(initialValues.route);
  const [status, setStatus] = React.useState(initialValues.status);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setDate(initialValues.date);
    setDepartTime(initialValues.departTime);
    setLat(initialValues.lat);
    setLng(initialValues.lng);
    setDriver(initialValues.driver);
    setHelper(initialValues.helper);
    setRoute(initialValues.route);
    setStatus(initialValues.status);
    setErrors({});
  };
  const validations = {
    date: [],
    departTime: [],
    lat: [],
    lng: [],
    driver: [],
    helper: [],
    route: [{ type: "JSON" }],
    status: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          date,
          departTime,
          lat,
          lng,
          driver,
          helper,
          route,
          status,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await DataStore.save(new Route(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "RouteCreateForm")}
      {...rest}
    >
      <TextField
        label="Date"
        isRequired={false}
        isReadOnly={false}
        value={date}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date: value,
              departTime,
              lat,
              lng,
              driver,
              helper,
              route,
              status,
            };
            const result = onChange(modelFields);
            value = result?.date ?? value;
          }
          if (errors.date?.hasError) {
            runValidationTasks("date", value);
          }
          setDate(value);
        }}
        onBlur={() => runValidationTasks("date", date)}
        errorMessage={errors.date?.errorMessage}
        hasError={errors.date?.hasError}
        {...getOverrideProps(overrides, "date")}
      ></TextField>
      <TextField
        label="Depart time"
        isRequired={false}
        isReadOnly={false}
        value={departTime}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date,
              departTime: value,
              lat,
              lng,
              driver,
              helper,
              route,
              status,
            };
            const result = onChange(modelFields);
            value = result?.departTime ?? value;
          }
          if (errors.departTime?.hasError) {
            runValidationTasks("departTime", value);
          }
          setDepartTime(value);
        }}
        onBlur={() => runValidationTasks("departTime", departTime)}
        errorMessage={errors.departTime?.errorMessage}
        hasError={errors.departTime?.hasError}
        {...getOverrideProps(overrides, "departTime")}
      ></TextField>
      <TextField
        label="Lat"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={lat}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              date,
              departTime,
              lat: value,
              lng,
              driver,
              helper,
              route,
              status,
            };
            const result = onChange(modelFields);
            value = result?.lat ?? value;
          }
          if (errors.lat?.hasError) {
            runValidationTasks("lat", value);
          }
          setLat(value);
        }}
        onBlur={() => runValidationTasks("lat", lat)}
        errorMessage={errors.lat?.errorMessage}
        hasError={errors.lat?.hasError}
        {...getOverrideProps(overrides, "lat")}
      ></TextField>
      <TextField
        label="Lng"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={lng}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              date,
              departTime,
              lat,
              lng: value,
              driver,
              helper,
              route,
              status,
            };
            const result = onChange(modelFields);
            value = result?.lng ?? value;
          }
          if (errors.lng?.hasError) {
            runValidationTasks("lng", value);
          }
          setLng(value);
        }}
        onBlur={() => runValidationTasks("lng", lng)}
        errorMessage={errors.lng?.errorMessage}
        hasError={errors.lng?.hasError}
        {...getOverrideProps(overrides, "lng")}
      ></TextField>
      <TextField
        label="Driver"
        isRequired={false}
        isReadOnly={false}
        value={driver}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date,
              departTime,
              lat,
              lng,
              driver: value,
              helper,
              route,
              status,
            };
            const result = onChange(modelFields);
            value = result?.driver ?? value;
          }
          if (errors.driver?.hasError) {
            runValidationTasks("driver", value);
          }
          setDriver(value);
        }}
        onBlur={() => runValidationTasks("driver", driver)}
        errorMessage={errors.driver?.errorMessage}
        hasError={errors.driver?.hasError}
        {...getOverrideProps(overrides, "driver")}
      ></TextField>
      <TextField
        label="Helper"
        isRequired={false}
        isReadOnly={false}
        value={helper}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date,
              departTime,
              lat,
              lng,
              driver,
              helper: value,
              route,
              status,
            };
            const result = onChange(modelFields);
            value = result?.helper ?? value;
          }
          if (errors.helper?.hasError) {
            runValidationTasks("helper", value);
          }
          setHelper(value);
        }}
        onBlur={() => runValidationTasks("helper", helper)}
        errorMessage={errors.helper?.errorMessage}
        hasError={errors.helper?.hasError}
        {...getOverrideProps(overrides, "helper")}
      ></TextField>
      <TextAreaField
        label="Route"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date,
              departTime,
              lat,
              lng,
              driver,
              helper,
              route: value,
              status,
            };
            const result = onChange(modelFields);
            value = result?.route ?? value;
          }
          if (errors.route?.hasError) {
            runValidationTasks("route", value);
          }
          setRoute(value);
        }}
        onBlur={() => runValidationTasks("route", route)}
        errorMessage={errors.route?.errorMessage}
        hasError={errors.route?.hasError}
        {...getOverrideProps(overrides, "route")}
      ></TextAreaField>
      <SelectField
        label="Status"
        placeholder="Please select an option"
        isDisabled={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date,
              departTime,
              lat,
              lng,
              driver,
              helper,
              route,
              status: value,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      >
        <option
          children="In progress"
          value="IN_PROGRESS"
          {...getOverrideProps(overrides, "statusoption0")}
        ></option>
        <option
          children="Finished"
          value="FINISHED"
          {...getOverrideProps(overrides, "statusoption1")}
        ></option>
        <option
          children="Waiting to start"
          value="WAITING_TO_START"
          {...getOverrideProps(overrides, "statusoption2")}
        ></option>
      </SelectField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
