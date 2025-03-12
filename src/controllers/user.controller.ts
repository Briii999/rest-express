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
        return;
      }
      res.status(200).send({
        message: "Users Data",
        data: filteredUsers,
      });
      return;
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
      return;
    }
    res.status(200).send({
      message: `User Data with id ${id}`,
      data: user,
    });
  }

  creteUser(req: Request, res: Response) {
    const { name, email } = req.body;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );
    const maxId = Math.max(...(users.map((item) => item.id) || 0));
    const newId = maxId + 1;
    const newUser: IUser = {
      id: newId,
      name,
      email,
    };
    users.push(newUser);
    fs.writeFileSync("./data/user.json", JSON.stringify(users));
    res.status(201).send({
      message: "User Created",
      data: newUser,
    });
  }

  deleteUserById(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );
    const index = users.findIndex((user) => user.id === Number(id));

    if (index !== -1) {
      users.splice(index, 1);
      fs.writeFileSync("./data/user.json", JSON.stringify(users));
      res.status(200).send({
        message: `User with id ${id} deleted`,
      });
      return;
    }

    res.status(404).send({
      message: `User with id ${id} not found`,
    });
  }

  updateUserById(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;

    const users: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );
    const userIndex = users.findIndex((user) => user.id === Number(id));

    if (userIndex === -1) {
      res.status(404).send({
        message: `User with id ${id} not found`,
      });
      return;
    }

    const fields = ["name", "email"];
    const isValid = Object.keys(req.body).every((key) => fields.includes(key));
    if (!isValid) {
      res.status(400).send({ message: "Invalid field in body" });
      return
    }

    const user: IUser = {
      id: Number(id),
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
    };

    users[userIndex] = user;
    fs.writeFileSync("./data/user.json", JSON.stringify(users));

    res.status(200).send({
      message: `User with id ${id} updated`,
      data: user,
    });
  }
}
