export interface Task {
  key: string;
  title: string;
  webUrl: string;
  priority: {
    name: string;
    color: string;
    iconUrl: string;
  };
}
