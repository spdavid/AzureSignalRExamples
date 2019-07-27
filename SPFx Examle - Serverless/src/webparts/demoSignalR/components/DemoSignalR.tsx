import * as React from 'react';
import styles from './DemoSignalR.module.scss';
import { IDemoSignalRProps } from './IDemoSignalRProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as signalR from '@aspnet/signalr';
import { HttpClient } from '@microsoft/sp-http';


export interface IDemoWpState
{
    message : any;
}
export default class DemoSignalR extends React.Component<IDemoSignalRProps, IDemoWpState> {
 
  public connection: signalR.HubConnection;
  private apiBaseUrl = 'http://localhost:7071';

 constructor(props: IDemoSignalRProps) {
   super(props);

   this.state = {
     message : {}
   };
 }


 public componentDidMount() {
   this.connection = new signalR.HubConnectionBuilder()
     .withUrl(`${this.apiBaseUrl}/api`)
     .configureLogging(signalR.LogLevel.Trace)
     .build();

    this.connection.on('newMessage', this.getMessage);

   this.connection.start()
     .then(() => console.log("Connected"))
     .catch(console.error);
 }

 public getMessage = (message) => {
     console.log(message);
     this.setState({message : message});
 }

 private sendMessage = async () => {
   console.log("send message");

   let body = JSON.stringify({
     sender: "david",
     text: "text send when pressing button",
     foo : "bar"
   });

    let response = await this.props.ctx.httpClient.post(`${this.apiBaseUrl}/api/messages`, HttpClient.configurations.v1, { body: body, headers : {"Content-Type": "application/json", "Accept" : "application/json;odata=verbose"} });


 }


 public render(): React.ReactElement<IDemoSignalRProps> {
   return (
     <div className={styles.demoWp}>
       <div className={styles.container}>
         <div className={styles.row}>
           <div className={styles.column}>
             <span className={styles.title}>Welcome to Davids Demo on SignalR!</span>
             <p className={styles.subTitle}>Incomming Messages Below.</p>
             <p className={styles.description}>{JSON.stringify(this.state.message)}</p>
             <a href="#" onClick={this.sendMessage} className={styles.button}>
               <span className={styles.label}>Send Message</span>
             </a>
           </div>
         </div>
       </div>
     </div>
   );
 }
}
