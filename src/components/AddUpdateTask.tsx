import React, { useRef, useState } from "react";
import axios from "axios";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";

function AddUpdateTask(props: any) {
  const inputRef = useRef<HTMLIonInputElement>(null);
  const API_URL =
    "https://us-east-1.aws.data.mongodb-api.com/app/task-manager-vhrcj/endpoint";

  const [loading, setLoading] = useState<boolean>(false);

  const confirm = () => {
    setLoading(true);
    if (
      inputRef.current?.value === "" ||
      inputRef.current?.value === undefined
    ) {
      openToast("Please enter valid task name.", "danger");
      setLoading(false);
    } else {
      let url;
      let obj;
      let msg: any;
      if (props.currentTask != undefined) {
        url = `${API_URL}/updateTask`;
        obj = {
          _id: props.currentTask._id,
          name: inputRef.current?.value,
        };
        msg = "updated";
      } else {
        url = `${API_URL}/addTask`;
        obj = {
          name: inputRef.current?.value,
        };
        msg = "added";
      }

      axios
        .post(url, obj)
        .then(
          (res) => {
            openToast(`Task ${msg} successfully.`, "success");
            props.onCancel("confirm");
          },
          (err) => {
            openToast("Something went wrong. Try again.", "danger");
          }
        )
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const [present] = useIonToast();

  const openToast = async (msg: string, color: string) => {
    present({
      message: msg,
      duration: 5000,
      color: color,
    });
  };

  return (
    <IonModal isOpen={props.modalOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={props.onCancel}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Task</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={confirm}>Submit</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Enter task</IonLabel>
          <IonInput
            aria-label="task"
            ref={inputRef}
            value={props.currentTask?.name}
            labelPlacement="stacked"
            placeholder="Enter task"
          />
        </IonItem>
      </IonContent>
      {loading ? <IonSpinner name="circular">Loading</IonSpinner> : ""}
    </IonModal>
  );
}

export default AddUpdateTask;
