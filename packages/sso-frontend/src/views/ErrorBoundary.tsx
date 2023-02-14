import React from 'react'
import { Button, Result } from 'antd'

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends React.Component {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <Result
          status='500'
          title='Error'
          subTitle={this.state.error.message || ''}
          extra={
            <Button
              type='primary'
              onClick={() => {
                window.location.reload()
              }}
            >
              Refresh
            </Button>
          }
        />
      )
    }
    return this.props['children']
  }
}
