import Axios from "axios";
import "dotenv/config";

const { API_URI } = process.env;

export class TetralympicAPI {
	private hostname: string;
	constructor() {
		this.hostname = API_URI!;
	}

	private async call(endpoint: string, method: string, data?: object): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			const path = this.hostname + endpoint;
			const req = Axios({
				method: method,
				url: path,
				data: data,
			})
				.then((response) => {
					resolve(response);
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	public insertDiscord(id: string, username: string, discriminator: string): Promise<boolean> {
		return new Promise<boolean>(async (resolve) => {
			this.call("/discord/user", "post", {
				id,
				username,
				discriminator,
			})
				.then((response) => {
					if (response.status === 201) resolve(true);
					else resolve(false);
				})
				.catch(() => resolve(false));
		});
	}

	public getDiscord(id: string): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.call("/discord/user/" + id, "get")
				.then((response) => {
					if (response.status === 200) {
						resolve(response.data);
					} else {
						reject(response);
					}
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	public bindTetrio(discordId: string, tetrioUsername: string): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			this.call("/discord/user/" + discordId, "put", {
				tetrioUsername,
			})
				.then((response) => {
					if ((response.status = 200)) {
						if (response.data.affectedRows === 0) resolve(false);
						resolve(true);
					} else resolve(false);
				})
				.catch(() => resolve(false));
		});
	}

	public whoIs(username: string): Promise<any> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				const res = await this.call("/discord/whois/" + username, "get");
				if ((res.status = 200)) {
					resolve(res.data.data[0]);
				} else reject(res.message);
			} catch (e) {
				reject(e);
			}
		});
	}

	public insertTetrio(username: string): Promise<any> {
		return new Promise<any>(async (resolve, reject) => {
			this.call("/tetrio/user/" + username, "post")
				.then((response) => {
					if ((response.status = 201)) resolve(true);
				})
				.catch((e) => {
					reject(e.response);
				});
		});
	}

	public getTetrioById(tetrioId: string): Promise<any> {
		return new Promise<any>(async (resolve) => {
			this.call("/tetrio/userById/" + tetrioId, "get")
				.then((response) => {
					if ((response.status = 200)) resolve(response.data);
				})
				.catch(() => {
					resolve(null);
				});
		});
	}

	public getCompetitions(): Promise<any> {
		return new Promise<any>(async (resolve) => {
			this.call("/competition/16", "get")
				.then((response) => {
					if ((response.status = 200)) resolve(response.data);
				})
				.catch(() => {
					resolve(null);
				});
		});
	}

	public register(tetrioId: string, compId: string): Promise<any> {
		return new Promise<any>(async (resolve, reject) => {
			this.call(`/registration/register/${tetrioId}/${compId}`, "post")
				.then((response) => {
					if ((response.status = 200)) resolve(response.data);
				})
				.catch((e) => {
					reject(e.response.data);
				});
		});
	}

	public unbind(discordId: string): Promise<any> {
		return new Promise<any>(async (resolve, reject) => {
			this.call(`/discord/unbind/${discordId}`, `delete`)
				.then((response) => {
					resolve(response.data.unbinded);
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	public verify(tetrioUsername: string, phoneNumber: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.call(`/tetrio/phone/${tetrioUsername}/${phoneNumber}`, `post`)
				.then((response) => {
					resolve(response);
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	public checkin(tetrioId: string): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.call(`/registration/checkin/${tetrioId}`, `post`)
				.then((response) => {
					resolve(response);
				})
				.catch((e) => {
					reject(e.response.status);
				});
		});
	}
}
