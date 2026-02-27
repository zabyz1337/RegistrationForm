import { useForm } from "react-hook-form";
import { checkUsernameAvailable, createUser } from "../api/usersApi";

const USERNAME_RE = /^[A-Za-z0-9_]+$/;
const NAME_RE = /^[A-Za-zА-Яа-яЁё]+$/;
const PHONE_RE = /^\+65\d{6}\s\d{2}-\d{2}$/;

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isValidating, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      age: "",
      phone: "",
      agree: false,
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    const payload = {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      age: data.age,
      phone: data.phone,
      agree: data.agree,
    };

    await createUser(payload);
    reset();
    alert("Registered!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>Registration</h2>

      <div>
        <label>
          Username
          <input
            type="text"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 4, message: "Min 4 characters" },
              maxLength: { value: 20, message: "Max 20 characters" },
              pattern: { value: USERNAME_RE, message: "Only A-Z, 0-9 and _" },
              validate: {
                isAvailable: async (value) => {
                  if (
                    !USERNAME_RE.test(value) ||
                    value.length < 4 ||
                    value.length > 20
                  ) {
                    return true;
                  }
                  const ok = await checkUsernameAvailable(value);
                  return ok || "Username is already taken";
                },
              },
            })}
          />
        </label>
        {errors.username && <p>{errors.username.message}</p>}
      </div>

      <div>
        <label>
          Email
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
          />
        </label>
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label>
          First name
          <input
            type="text"
            {...register("firstName", {
              required: "First name is required",
              minLength: { value: 2, message: "Min 2 characters" },
              pattern: {
                value: NAME_RE,
                message: "Only letters (latin/cyrillic)",
              },
            })}
          />
        </label>
        {errors.firstName && <p>{errors.firstName.message}</p>}
      </div>

      <div>
        <label>
          Last name
          <input
            type="text"
            {...register("lastName", {
              required: "Last name is required",
              minLength: { value: 2, message: "Min 2 characters" },
              pattern: {
                value: NAME_RE,
                message: "Only letters (latin/cyrillic)",
              },
            })}
          />
        </label>
        {errors.lastName && <p>{errors.lastName.message}</p>}
      </div>

      <div>
        <label>
          Password
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
              validate: {
                hasUppercase: (v) =>
                  /[A-Z]/.test(v) || "Must contain at least 1 uppercase letter",
                hasDigit: (v) =>
                  /\d/.test(v) || "Must contain at least 1 digit",
              },
            })}
          />
        </label>
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div>
        <label>
          Confirm password
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (v) => v === passwordValue || "Passwords do not match",
            })}
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      <div>
        <label>
          Age
          <input
            type="number"
            {...register("age", {
              required: "Age is required",
              valueAsNumber: true,
              min: { value: 18, message: "Min age is 18" },
              max: { value: 100, message: "Max age is 100" },
            })}
          />
        </label>
        {errors.age && <p>{errors.age.message}</p>}
      </div>
      <div>
        <label>
          Phone (+65XXXXXX XX-XX)
          <input
            type="tel"
            placeholder="+65123456 78-90"
            {...register("phone", {
              required: "Phone is required",
              pattern: { value: PHONE_RE, message: "Format: +65XXXXXX XX-XX" },
              validate: (v) => {
                const digits = (v.match(/\d/g) || []).join("");
                return (
                  digits.length === 12 ||
                  "Must contain exactly 10 digits after +65"
                );
              },
            })}
          />
        </label>
        {errors.phone && <p>{errors.phone.message}</p>}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            {...register("agree", { required: "You must agree to the rules" })}
          />
          I agree to the rules
        </label>
        {errors.agree && <p>{errors.agree.message}</p>}
      </div>

      <button type="submit" disabled={!isValid || isValidating || isSubmitting}>
        Submit
      </button>

      <div>
        <small>isValid: {String(isValid)}</small>
        <br />
        <small>isValidating: {String(isValidating)}</small>
        <br />
        <small>isSubmitting: {String(isSubmitting)}</small>
      </div>
    </form>
  );
}
