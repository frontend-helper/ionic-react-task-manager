import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { addSharp } from "ionicons/icons";
import "./Home.css";
import { useRef, useState } from "react";
import TaskList from "../components/TaskList";

const Home: React.FC = () => {
  const childRef = useRef<any>(null);
  const addTaskHandler = () => {
    if (childRef && childRef.current) {
      childRef.current.addTaskModal();
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task manager</IonTitle>
          <IonButton slot="end" aria-label="Favorite" onClick={addTaskHandler}>
            <IonIcon icon={addSharp}></IonIcon> Add task
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <TaskList ref={childRef} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
