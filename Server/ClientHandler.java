package Server;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class ClientHandler implements Runnable {

	private Socket mySocket;
	private String id;
	private Server server;
	private InputStream input;
	private OutputStream output;

	public ClientHandler(Socket mySocket, String id, Server server) {
		this.mySocket = mySocket;
		this.id = id;
		this.server = server;
		try {
			this.input = mySocket.getInputStream();
			this.output = mySocket.getOutputStream();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void run() {
		try {
			byte[] buffer = new byte[1024];
			int bytesRead;
			while ((bytesRead = input.read(buffer)) != -1) {
				String msg = new String(buffer, 0, bytesRead);
				server.broadcastMessage(this.id, this.id + " says: " + msg);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void sendMessage(String msg) {
		try {
			output.write(msg.getBytes());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public Socket getMySocket() {
		return mySocket;
	}

	public String getId() {
		return id;
	}

	public Server getServer() {
		return server;
	}

	public InputStream getInput() {
		return input;
	}

	public OutputStream getOutput() {
		return output;
	}
}
