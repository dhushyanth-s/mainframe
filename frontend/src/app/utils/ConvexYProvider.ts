"use client";

import * as Y from "yjs";
import { Doc } from "yjs";
import { api } from "../../../convex/_generated/api"; // Adjust paths
import { ConvexReactClient, useMutation, useQuery } from "convex/react";
import { convex } from "./ConvexClientProvider";

export class ConvexProvider {
  private doc: Doc;
  private docId: string;
  private convexProvider: typeof ConvexReactClient;

  constructor(doc: Y.Doc, docId: string, convexProvider = ConvexReactClient) {
    this.doc = doc;
    this.docId = docId;
		this.convexProvider = convexProvider

    this.doc.on("update", this.handleLocalUpdate);

		const watch = convex.watchQuery(api.getYDoc.getYDoc, {
			docId: this.docId
		})

		// if (watch.localQueryResult()) {
		// 	const array = new Uint8Array(watch.localQueryResult()!)
		// 	Y.applyUpdateV2(this.doc, array)
		// }

		watch.onUpdate(() => {
			console.log("Remote Update", watch.localQueryResult())
		})
  }

  handleLocalUpdate = (update: Uint8Array) => {
    const buf = new Uint8Array(update).buffer;
		const state = Y.encodeStateAsUpdateV2(this.doc)
		console.log("Local Update", update)
  };

	handleRemoteUpdate() {

	}

  destroy() {
    this.doc.off("update", this.handleLocalUpdate);
  }
}
