// We need this in order to use @Decorators
// DO NOT CHANGE THE LINE SPACING OF THE IMPORTS
// OR THE LINTER WILL REORDER THEM
import 'reflect-metadata';

console.log("Run me first");
import './before';

import '@config/index';

import express from "express";
import loadersFactory from './loaders';

async function startServer() {
  const app = express();

  // Intiialize all registered loaders.
  await loadersFactory({ expressApp: app });
}

startServer();
