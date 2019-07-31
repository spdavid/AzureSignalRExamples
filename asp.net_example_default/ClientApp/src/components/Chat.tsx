import * as React from 'react';
import * as signalR from '@aspnet/signalr';

export interface IChatState {
    username: string;
    newMessage: string;
    messages: Array<IMessage>;
    ready: boolean;
    inputText : string;
}

export interface IChatProps {

}

export interface IMessage {
    id: number,
    sender: string,
    text: string
}




export default class Chat extends React.Component<IChatProps, IChatState> {

    private connection: signalR.HubConnection;
    private counter = 0;
    private currentText = "";
    private currentUser = "";
    private currentMessages: Array<IMessage> = [];

    constructor(props: IChatProps) {
        super(props);

        this.state = {
            username: '',
            newMessage: '',
            messages: [],
            ready: false,
            inputText : ""
        };
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`/myhub`)
            .configureLogging(signalR.LogLevel.Trace)
            .build();

    }

    public componentDidMount() {
       this.currentUser = prompt("Enter your name") as string;
        this.connection.on('ReceiveMessage', this.newMessage);
        this.connection.start()
            .then(() => this.setState({ ready: true }))
            .catch(console.error);
        console.log(this.connection);
    }

    public newMessage = (user: string, message: string) => {

        let newMessage: IMessage = {
            id: this.counter++,
            sender: user,
            text: message
        }

        this.currentMessages.unshift(newMessage);
        this.setState({ messages: this.currentMessages });
    }

    public sendMessage = async () => {
        this.connection.send("SendMessage", this.currentUser, this.currentText);
        this.setState({inputText : ""});

    }

    private textChanged = (e: any) => {
        this.setState({inputText : e.target.value});
        this.currentText = e.target.value;
    }

    public render(): React.ReactElement<IChatProps> {
        return (
            <div id="app" className="container">
                <h3>Chat example</h3>
                <div className="row">
                    <div className="signalr-demo col-sm">
                        <hr />
                        <form onSubmit={e => { e.preventDefault(); this.sendMessage(); }} >
                            <input value={this.state.inputText} onChange={this.textChanged} type="text" id="message-box" className="form-control" placeholder="Type message here..." />
                        </form>
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
                            {this.state.messages.map(message => {
                                return (<div key={message.id} className="row">
                                    <div className="col-sm">
                                        <hr />
                                        <div>
                                            <div style={{ display: "inline-block", paddingLeft: "12px" }}>
                                                <div>
                                                    <span className="text-info small"><strong>{message.sender}</strong></span>
                                                </div>
                                                <div>
                                                    {message.text}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>);
                            })}
                        </div>

                    )}

            </div>
        );
    }
}
