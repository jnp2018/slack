package slack;

import java.io.*;
import java.net.*;

public class ClientListener implements Runnable {

	private Socket socket;
	private InputStream input;


	public ClientListener(Socket socket) {
		this.socket = socket;
		try{
			this.input = socket.getInputStream();
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
				System.out.println(msg);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
