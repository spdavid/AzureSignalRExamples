import * as React from 'react';
import * as signalR from '@aspnet/signalr';

export interface IGroupsState {
  ready:boolean;
  groupText : string;
}

export interface IGroupsProps {

}

export interface IMessage {
    id: number,
    sender: string,
    text: string
}




export default class Groups extends React.Component<IGroupsProps, IGroupsState> {

    private connection: signalR.HubConnection;
  

    constructor(props: IGroupsProps) {
        super(props);

        this.state = {
            ready: false,
            groupText: ""
        };
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`/myhub`)
            .configureLogging(signalR.LogLevel.Trace)
            .build();

    }

    public componentDidMount() {
      
         this.connection.on('sendGroup', this.newMessage);
        this.connection.start()
            .then(() => this.setState({ ready: true }))
            .catch(console.error);
        console.log(this.connection);
    }

    public newMessage = (group: string, message: string) => {
    console.log("newMessage");
     this.setState({
         groupText : "Message from " + group + ": " + message
     });
    }

    

    public sendMessage = async (groupName : string) => {
      this.connection.send("SendGroup", groupName);
    }

    public joinGroup = (groupName : string) => {
        this.connection.send("JoinRoom", groupName);
    } 


    public render(): React.ReactElement<IGroupsProps> {
        return (
            <div id="app" className="container">
                <h3>Groups Example</h3>
                <div className="row">
                    <div className="signalr-demo col-sm">
                        <hr />
                       <input type="button" onClick={() => {this.joinGroup("GroupA")}} value="Join Group A"/> &nbsp;
                       <input type="button" onClick={() => {this.joinGroup("GroupB")}} value="Join Group B"/>
                       <hr />

                       <input type="button" onClick={() => {this.sendMessage("GroupA")}}  value="Send Message Group A"/>  &nbsp;
                       <input type="button" onClick={() => {this.sendMessage("GroupB")}}  value="Send Message Group B"/>

                    </div>
                </div>
                {!this.state.ready ? (
                    <div className="row">
                        <div className="col-sm">
                            <div>Loading...</div>
                        </div>
                    </div>
                ) : (
                        <div>
                           {this.state.groupText}
                        </div>

                    )}

            </div>
        );
    }
}
