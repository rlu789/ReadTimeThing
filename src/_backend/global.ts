import express = require('express');

export const app: express.Application = express();
import httpImport = require('http');
export const http = new httpImport.Server(app);
import ioImport = require('socket.io');
export const io = ioImport(http);