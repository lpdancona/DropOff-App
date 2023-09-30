/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
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
    van: "",
    date: "",
    departTime: "",
    lat: "",
    lng: "",
    driver: "",
    helper: "",
    route: "",
  };
  const [van, setVan] = React.useState(initialValues.van);
  const [date, setDate] = React.useState(initialValues.date);
  const [departTime, setDepartTime] = React.useState(initialValues.departTime);
  const [lat, setLat] = React.useState(initialValues.lat);
  const [lng, setLng] = React.useState(initialValues.lng);
  const [driver, setDriver] = React.useState(initialValues.driver);
  const [helper, setHelper] = React.useState(initialValues.helper);
  const [route, setRoute] = React.useState(initialValues.route);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setVan(initialValues.van);
    setDate(initialValues.date);
    setDepartTime(initialValues.departTime);
    setLat(initialValues.lat);
    setLng(initialValues.lng);
    setDriver(initialValues.driver);
    setHelper(initialValues.helper);
    setRoute(initialValues.route);
    setErrors({});
  };
  const validations = {
    van: [],
    date: [],
    departTime: [],
    lat: [],
    lng: [],
    driver: [],
    helper: [],
    route: [],
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
          van,
          date,
          departTime,
          lat,
          lng,
          driver,
          helper,
          route,
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
        label="Van"
        isRequired={false}
        isReadOnly={false}
        value={van}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              van: value,
              date,
              departTime,
              lat,
              lng,
              driver,
              helper,
              route,
            };
            const result = onChange(modelFields);
            value = result?.van ?? value;
          }
          if (errors.van?.hasError) {
            runValidationTasks("van", value);
          }
          setVan(value);
        }}
        onBlur={() => runValidationTasks("van", van)}
        errorMessage={errors.van?.errorMessage}
        hasError={errors.van?.hasError}
        {...getOverrideProps(overrides, "van")}
      ></TextField>
      <TextField
        label="Date"
        isRequired={false}
        isReadOnly={false}
        value={date}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              van,
              date: value,
              departTime,
              lat,
              lng,
              driver,
              helper,
              route,
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
              van,
              date,
              departTime: value,
              lat,
              lng,
              driver,
              helper,
              route,
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
              van,
              date,
              departTime,
              lat: value,
              lng,
              driver,
              helper,
              route,
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
              van,
              date,
              departTime,
              lat,
              lng: value,
              driver,
              helper,
              route,
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
              van,
              date,
              departTime,
              lat,
              lng,
              driver: value,
              helper,
              route,
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
              van,
              date,
              departTime,
              lat,
              lng,
              driver,
              helper: value,
              route,
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
      <TextField
        label="Route"
        isRequired={false}
        isReadOnly={false}
        value={route}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              van,
              date,
              departTime,
              lat,
              lng,
              driver,
              helper,
              route: value,
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
      ></TextField>
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
