import { toast } from 'react-hot-toast';
import { authenticate } from './helper'
export async function passwordReset(values)
{
    const errors = {};
    if(!values.password)
    {
        errors.password = toast.error('Password Required... !');
    }
    else if(!values.confirmPassword)
    {
        errors.confirmPassword = toast.error('Re-Enter Password... !');
    }
    else if(values.password != values.confirmPassword)
    {
        errors.notMatched = toast.error(`Password doesn't not match... !`)
    }
    else
    {
        errors.success = toast.success('OTP Sent Succesfully... !')
    }

    return errors;
}

export async function loginValidate(values) {
  const errors = {}; 

  if (!values.username) {
    errors.username = toast.error("Username Required... !");
  } else if (!values.password) {
    console.log(values.password);
    errors.password = toast.error("Password Required... !");
  } else if (values.password.length < 4) {
    errors.password = toast.error("Password is too weak... !");
  }

  if(values.username){
    const {status} = await authenticate(values.username);

    if(status !== 200)
      {
        errors.exist = toast.error("User Doesn't Exist... !");
      }
  }

  return errors; 
}

export async function createOrderValidate(values) {
  const errors = {}; 
  if(!values.customerName)
  {
    errors.customerName = toast.error('Customer Name Required... !');
  }

  return errors; 
}

export async function createCustomerValidate(values) {
  const errors = {};
  if (!values.customerName) {
    errors.customerName = toast.error("Customer Name Required... !");
  }
  else if(!values.phone)
  {
    errors.phone = toast.error('Phone Number Required... !');
  }
  else{
    errors.success = toast.success('Customer Added Successfully... !');
  }

  return errors;
}

export async function registerValidate(values) {
    const errors = {}; 
    if(!values.username)
    {
        errors.username = toast.error('Username Required... !');
    }
    else if(!values.email)
    {
      errors.email = toast.error('Email Required... !');
    }
    else if (!values.password) {
      errors.password = toast.error('Password Required... !');
    } else if (values.password.length < 4) {
      errors.password = toast.error('Password is too weak... !');
    }
    else 
    {
        for(let i = 0 ; i < values.username.length ; i++)
        {
            if(values.username[i] == " ")
            {
              errors.username = toast.error("Username Can't contain spaces... !");
            }
        }
    }
  
    return errors; 
}

export async function profileValidate(values) {
  const errors = {}; 
  // if(!values.email)
  // {
  //   errors.email = toast.error('Email Required... !');
  // }

  errors.success - toast.success('Profile Update Success');
  return errors; 
}

export async function supportValidate(values) {
  const errors = {};
  if (!values.restaurantName) {
    errors.restaurantName = toast.error("Restaurant Name Required... !");
  } else if (!values.phoneNumber) {
    errors.phoneNumber = toast.error("Phone Required... !");
  } else if (!values.explainIssue) {
    errors.explainIssue = toast.error("Describe your problem ... !");
  }

  return errors;
}