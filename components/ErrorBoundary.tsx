"use client";

import React from "react";
import { color, radius, fontSize } from "@/lib/tokens";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 32,
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: color.black,
            marginBottom: 12,
          }}>
            Something went wrong
          </div>
          <div style={{
            fontSize: fontSize.xl,
            fontWeight: 500,
            color: color.textSecondary,
            marginBottom: 32,
          }}>
            An unexpected error occurred.
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: "12px 28px",
              borderRadius: radius.full,
              background: color.green,
              color: color.black,
              fontSize: fontSize.xl,
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
