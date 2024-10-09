package Server;

import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

public class Server {
	private static int PORT = 5000;
	private List<ClientHandler> clients = new ArrayList<>();

	/**
	 * 
	 */
	public void startServer() {
		try {
			ServerSocket serverSocket = new ServerSocket(PORT);
			System.out.println("server started, listening on PORT " + PORT);
			while (true) {
				Socket clientSocket = serverSocket.accept();
				System.out.println("new client connected " + clientSocket.getInetAddress().getHostAddress());

				ClientHandler clientHandler = new ClientHandler(
						clientSocket,
						String.valueOf(System.currentTimeMillis()),
						this);
				clients.add(clientHandler);
				new Thread(clientHandler).start();

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void broadcastMessage(String id, String msg) {
		for (ClientHandler client : clients) {
			if (client.getId() == id) {
				client.sendMessage("*self*" + msg);
			} else
				client.sendMessage(msg);
		}
	}

}
