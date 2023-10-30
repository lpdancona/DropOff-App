/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type AddressListCreateFormInputValues = {
    order?: number;
    latitude?: number;
    longitude?: number;
};
export declare type AddressListCreateFormValidationValues = {
    order?: ValidationFunction<number>;
    latitude?: ValidationFunction<number>;
    longitude?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AddressListCreateFormOverridesProps = {
    AddressListCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    order?: PrimitiveOverrideProps<TextFieldProps>;
    latitude?: PrimitiveOverrideProps<TextFieldProps>;
    longitude?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AddressListCreateFormProps = React.PropsWithChildren<{
    overrides?: AddressListCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: AddressListCreateFormInputValues) => AddressListCreateFormInputValues;
    onSuccess?: (fields: AddressListCreateFormInputValues) => void;
    onError?: (fields: AddressListCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AddressListCreateFormInputValues) => AddressListCreateFormInputValues;
    onValidate?: AddressListCreateFormValidationValues;
} & React.CSSProperties>;
export default function AddressListCreateForm(props: AddressListCreateFormProps): React.ReactElement;
