import { UserProfile, useUser } from "@auth0/nextjs-auth0";
import { collection, doc, setDoc } from "firebase/firestore";
import { Button, Label, Textarea } from "flowbite-react";
import { Formik, FormikHelpers, useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import { useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";
import { selectedCalendarState } from "../../atoms";
import { firestore } from "../../firebase/clientApp";
import { useCreateCalendarMutation } from "../../mutations/createCalendarMutation";
import { SelectCalendar } from "./../SelectCalendar";

// interface for the form
interface FormValues {
  title: string;
  description: string;
  date: Date;
  duration: number;
  durationUnit: string;
}

const DatePickerField = ({ ...props }: any) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <DatePicker
      {...field}
      {...props}
      selected={(field.value && new Date(field.value)) || null}
      onChange={(val) => {
        setFieldValue(field.name, val);
      }}
    />
  );
};

export const CreateEvent = () => {
  const { user } = useUser();
  const createCalendarMutation = useCreateCalendarMutation();
  const externalCalendar = useRecoilValue(selectedCalendarState);

  const userId = user?.sub as string;
  const initialFormValues: FormValues = {
    title: "",
    description: "",
    date: new Date(),
    duration: 30,
    durationUnit: "minutes",
  };

  const handleCreateEvent = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    const newEvent = {
      createdBy: userId,
      externalCalendarId: externalCalendar.id,
      ...values,
    };

    createCalendarMutation.mutate(newEvent);

    setSubmitting(false);
    resetForm();
  };

  const loading = (
    <div className="text-center">
      <svg
        role="status"
        className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  );

  return (
    <div className="transition-all">
      {createCalendarMutation.isLoading ? (
        loading
      ) : (
        <>
          <h1 className="text-xl font-bold dark:text-gray-300">
            Create an Event
          </h1>
          <Formik
            initialValues={initialFormValues}
            onSubmit={handleCreateEvent}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              /* and other goodies */
            }) => (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-4">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="title" value="Event Name" />
                    </div>
                    <input
                      type="text"
                      id="title"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="John"
                      required
                      name="title"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.title}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email2" value="Event Date" />
                    </div>
                    <DatePickerField
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="date"
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="duration" value="Event Duration" />
                    </div>
                    <input
                      type="number"
                      id="duration"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="1"
                      required
                      name="duration"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.duration}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="durationUnit"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                    >
                      Duration Unit
                    </label>
                    <select
                      id="durationUnit"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={handleChange}
                      name="durationUnit"
                      value={values.durationUnit}
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hour">Hours</option>
                      <option value="day">Days</option>
                    </select>
                  </div>
                </div>
                <div>
                  <SelectCalendar />
                </div>
                <div>
                  <div id="textarea">
                    <div className="mb-2 block">
                      <Label htmlFor="description" value="Description" />
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Describe your event..."
                      required={true}
                      rows={4}
                      name="description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                    />
                  </div>
                </div>
                <Button type="submit">Schedule Event</Button>
              </form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};
