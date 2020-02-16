import React from 'react';
import gql from 'graphql-tag';
import MaskedInput from 'react-text-mask';
import { useMutation } from 'react-apollo';
import Button from "@material-ui/core/Button";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { GET_CUSTOMERS } from './customers';

const ADD_CUSTOMER = gql`
  mutation CreateCustomer(
    $Name: String
    $Email: String
    $Phone: String
    $Address: String
    $ZipCode: String
  ) {
    CreateCustomer(
      Name: $Name
      Email: $Email
      Phone: $Phone
      Address: $Address
      ZipCode: $ZipCode
    )
  }
`;

const UPLOAD_FILE = gql`
  mutation SingleUpload($file: Upload!) {
    singleUpload(file: $file) {
      filename
      mimetype
      encoding
    }
  }
`;

const zipCodeRegEx = /^\d+$/;
const maskedPhoneRegExp = /^\(\d{3}\) \d{3}-\d{4}$/;
const phoneNumberMask = ["(", /[1-9]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];

export function CustomersForm() {
    const [addCustomer, { data }] = useMutation(ADD_CUSTOMER, {
        refetchQueries: [{ query: GET_CUSTOMERS }]
    });
    console.log(data);

    const [uploadFile, { file }] = useMutation(
        UPLOAD_FILE
    );
    console.log(file);

    return (
        <div id="customerForm">
            <h3>ADD AGENT</h3>
            <Formik
                initialValues={{
                    Name: "",
                    Email: "",
                    Phone: "",
                    Address: "",
                    ZipCode: "",
                    Fl: null
                }}

                validationSchema={Yup.object().shape(
                    {
                        Name: Yup.string().required("Name is required"),
                        Email: Yup.string()
                            .email("Email is invalid")
                            .required("Email is required"),
                        Phone: Yup.string()
                            .matches(maskedPhoneRegExp, "Phone number is invalid")
                            .required("Phone number is required"),
                        Address: Yup.string().required("Address is required"),
                        ZipCode: Yup.string()
                            .matches(zipCodeRegEx, "Zip Code is invalid")
                            .required("ZipCode is required")
                    }
                )}

                onSubmit={(fields, { resetForm }) => {
                    addCustomer({
                        variables: {
                            ...fields
                        }
                    });

                    resetForm();
                }}

                render={({ errors, touched, handleChange, handleBlur }) => (
                    <Form encType="multipart/form-data">
                        <Field
                            name="Name"
                            placeholder="Name"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.Name && touched.Name ? "text-input error" : "text-input"}
                        />
                        {errors.Name && touched.Name && (
                            <div className="input-feedback">{errors.Name}</div>
                        )}

                        <Field
                            name="Email"
                            placeholder="Email"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.Email && touched.Email ? "text-input error" : "text-input"}
                        />
                        {errors.Email && touched.Email && (
                            <div className="input-feedback">{errors.Email}</div>
                        )}

                        <Field
                            name="Phone"
                            render={({ field }) => (
                                <MaskedInput
                                    {...field}
                                    mask={phoneNumberMask}
                                    type="text"
                                    placeholder="Phone"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.Phone && touched.Phone ? "text-input error" : "text-input"}
                                />
                            )}
                        />
                        {errors.Phone && touched.Phone && (
                            <div className="input-feedback">{errors.Phone}</div>
                        )}

                        <Field
                            name="Address"
                            placeholder="Address"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.Address && touched.Address ? "text-input error" : "text-input"}
                        />
                        {errors.Address && touched.Address && (
                            <div className="input-feedback">{errors.Address}</div>
                        )}

                        <Field
                            name="ZipCode"
                            placeholder="Zip Code"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.ZipCode && touched.ZipCode ? "text-input error" : "text-input"}
                        />
                        {errors.ZipCode && touched.ZipCode && (
                            <div className="input-feedback">{errors.ZipCode}</div>
                        )}

                        <input
                            name="Fl"
                            type="file"
                            onChange={({ target: { files } }) => {
                                const file = files[0];
                                file && uploadFile({ variables: { file } });
                            }}
                            onBlur={handleBlur}
                            className={errors.Fl && touched.Fl ? "text-input error" : "text-input"}
                        />

                        <Button type="submit" variant="outlined" color="primary">
                            Register
                        </Button>
                        {" "}
                        <Button type="reset" variant="outlined" color="secondary">
                            Reset
                        </Button>
                    </Form>
                )}
            />
        </div>
    );
}