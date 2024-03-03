import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';


export const getUsers = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        users,
    });
}

export const createUser = async (req, res) => {
    const { nombre, username, correo, password, role } = req.body;
    const user = new User({ nombre, username, correo, password, role });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(200).json({
        user,
    });
}

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });

    res.status(200).json({
        user,
    });
}

export const updateUser = async (req, res = response) => {
    const { id } = req.params;
    const { _id, newPassword, google, correo, oldPassword, ...rest } = req.body;

    const requestingUserId = req.usuario._id;

    if (!oldPassword) {
        return res.status(400).json({
            msg: 'oldPassword is required'
        });
    }

    if (!newPassword) {
        return res.status(400).json({
            msg: 'newPassword is required'
        });
    }

    if (newPassword && newPassword.length < 6) {
        return res.status(400).json({
            msg: 'The new password must be at least 6 characters'
        });
    }

    const user = await User.findById(id);

    if (!bcryptjs.compareSync(oldPassword, user.password)) {
        return res.status(400).json({
            msg: 'The current password is not valid'
        });
    }

    if (requestingUserId.toString() !== id) {
        return res.status(403).json({
            msg: 'Access denied, only the profile owner can edit it'
        });
    }

    if (newPassword) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(newPassword, salt);
    }

    await User.findByIdAndUpdate(id, rest);

    const userUpdated = await User.findOne({ _id: id });

    res.status(200).json({
        msg: 'Successfully updated user',
        userUpdated,
    });
}
