import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  IonSpinner,
  IonItem,
  IonLabel,
  IonList,
  IonButtons,
  IonButton,
  IonIcon,
  IonAlert,
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonInput,
  IonTitle,
  useIonToast,
} from "@ionic/react";
import { createSharp, trashSharp } from "ionicons/icons";
import axios from "axios";
import AddUpdateTask from "./AddUpdateTask";

interface Task {
  _id: string;
  name: string;
}

const TaskList = forwardRef((props: any, ref) => {
  React.useEffect(() => {
    getTasks();
  }, []);

  useImperativeHandle(ref, () => ({
    addTaskModal() {
      setModalOpen(true);
      setCurrentTask(null);
    },
  }));

  const API_URL =
    "https://us-east-1.aws.data.mongodb-api.com/app/task-manager-vhrcj/endpoint";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAlertOpen, setAlertOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const alertButtons: any[] = [
    {
      text: "Cancel",
      role: "cancel",
    },
    {
      text: "Delete",
      role: "confirm",
    },
  ];
  const [selectedId, setSelectedId] = useState<string>("");
  const [present] = useIonToast();

  const openToast = async (msg: string, color: string) => {
    present({
      message: msg,
      duration: 5000,
      color: color,
    });
  };

  const getTasks = async () => {
    axios.get(`${API_URL}/tasks`).then(
      (response) => {
        setTasks(response.data);
        setLoading(false);
      },
      (error) => {
        console.error(error.message);
        setLoading(false);
      }
    );
  };

  const tasksList = tasks.map((task) => {
    return (
      <IonItem key={task._id}>
        <IonLabel>{task.name}</IonLabel>
        <IonButtons>
          <IonButton title="Edit task" onClick={(e) => editTask(task)}>
            <IonIcon icon={createSharp}></IonIcon>
          </IonButton>
          <IonButton
            title="Delete task"
            onClick={(e) => deleteTaskModal(task._id)}
          >
            <IonIcon icon={trashSharp}></IonIcon>
          </IonButton>
        </IonButtons>
      </IonItem>
    );
  });

  const editTask = (task: any) => {
    setModalOpen(true);
    setCurrentTask(task);
  };

  const deleteTaskModal = (id: string) => {
    setSelectedId(id);
    setAlertOpen(true);
  };

  function deleteTask() {
    setLoading(true);
    axios.delete(`${API_URL}/deleteTask?id=${selectedId}`).then(
      (res) => {
        getTasks();
        setLoading(false);
        openToast("Task deleted successfully.", "success");
      },
      (error) => {
        console.error(error.message);
        setLoading(false);
        openToast("Something went wrong. Try again.", "danger");
      }
    );
  }

  function setResult(role: any) {
    if (role === "confirm") {
      setAlertOpen(false);
      deleteTask();
    } else {
      setSelectedId("");
      setAlertOpen(false);
    }
  }

  const cancel = (identifier: string) => {
    setModalOpen(false);
    setCurrentTask(null);
    if (identifier === "confirm") {
      getTasks();
    }
  };

  return (
    <>
      {loading ? (
        <IonSpinner name="circular">Loading</IonSpinner>
      ) : tasks.length > 0 ? (
        <IonList lines="full">{tasksList}</IonList>
      ) : (
        <IonList lines="full">
          <IonItem>
            <IonLabel>No task</IonLabel>
          </IonItem>
        </IonList>
      )}

      <IonAlert
        isOpen={isAlertOpen}
        header="Are you sure ?"
        buttons={alertButtons}
        onDidDismiss={({ detail }) => setResult(detail.role)}
      ></IonAlert>

      {modalOpen ? (
        <AddUpdateTask
          modalOpen={modalOpen}
          currentTask={currentTask}
          onCancel={cancel}
        />
      ) : (
        ""
      )}
    </>
  );
});

export default TaskList;
