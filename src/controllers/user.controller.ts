import { Request, Response } from "express";
import fs from "fs";
import { IUser } from "../type";
export class UserController {
  getUsers(req: Request, res: Response) {
    const { name } = req.query;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );

    if (name) {
      const filteredUsers: IUser[] = users.filter((item) =>
        item.name.toLowerCase().includes((name as string).toLowerCase())
      );

      if (filteredUsers.length === 0) {
        res.status(404).send({
          message: `User with name ${name} not found`,
        });
      }
      res.status(200).send({
        message: "Users Data",
        data: filteredUsers,
      }); 
    }

    res.status(200).send({
      message: "Users Data",
      data: users,
    });
  }

  getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );
    const user: IUser | undefined = users.find(
      (user) => user.id === Number(id)
    );

    if (!user) {
      res.status(404).send({
        message: `User with id ${id} not found`,
      });
    }
    res.status(200).send({
      message: `User Data with id ${id}`,
      data: user,
    });
  }

  getUserByName(req: Request, res: Response) {
    const { name } = req.query;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );
  }
}
