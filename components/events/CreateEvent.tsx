import { useUser } from "@auth0/nextjs-auth0";
import { collection, doc, setDoc } from "firebase/firestore";
import { Button, Label, Textarea } from "flowbite-react";
import { Formik, FormikHelpers, useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import { useRecoilState, useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";
import { selectedCalendarState } from "../../atoms";
import { firestore } from "../../firebase/clientApp";

// interface for the form
interface FormValues {
  title: string;
  description: string;
  date: Date;
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
  let calendarId;
  const { user, error: userError, isLoading: isUserLoading } = useUser();
  const externalCalendar = useRecoilValue(selectedCalendarState);

  const userId = user?.sub as string;
  const initialFormValues: FormValues = {
    title: "",
    description: "",
    date: new Date(),
  };

  const handleCreateEvent = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    console.log(externalCalendar);
    const newEvent = {
      title: values.title,
      description: values.description,
      date: values.date,
      createdBy: user?.sub,
      externalCalendarId: externalCalendar.id,
    };

    const eventId = uuid();
    const collectionPath = `users/${userId}/events`;
    const col = collection(firestore, collectionPath);
    const eventRef = doc(firestore, col.path, eventId);
    await setDoc(eventRef, newEvent, {
      merge: true,
    });
    setSubmitting(false);
    resetForm();
  };

  return (
    <>
      <h1 className="text-xl font-bold dark:text-gray-300">Create an Event</h1>
      <Formik initialValues={initialFormValues} onSubmit={handleCreateEvent}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-2">
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
                />
              </div>
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
  );
};
