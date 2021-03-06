describe('display module', () => {
  let mocks;

  const zero = new Uint8Array([255, 0, 127, 255, 0, 127, 248, 0, 15, 248, 0, 15, 248, 0, 15, 199, 255, 129, 199, 255, 129, 199, 255, 129, 199, 255, 241, 199, 255, 241, 192, 255, 241, 192, 255, 241, 192, 0, 1, 248, 0, 15, 248, 0, 15, 255, 0, 127, 255, 0, 127, 255, 0, 127, 255, 255, 255]);

  beforeEach(() => {
    mocks = {
      pinMode: jest.fn(),
      digitalWrite: jest.fn(),
      LOW: 0,
      HIGH: 1,
      SPI1: {
        setup: jest.fn(),
        send: jest.fn()
      }
    };

    Object.assign(global, mocks);
  });

  describe('writeChar', () => {
    it('should display the given buffer to the screen', () => {
      const display = require('./display');
      const { writeChar } = display;
      writeChar(zero, 24, 19, 0, 0)
      expect(mocks.SPI1.send).toHaveBeenCalledWith(
        new Uint8Array([255, 0, 127, 255, 0, 127, 248, 0, 15, 248, 0, 15, 248, 0, 15, 199, 255, 129, 199, 255, 129, 199, 255, 129, 199, 255, 241, 199, 255, 241, 192, 255, 241, 192, 255, 241, 192, 0, 1, 248, 0, 15, 248, 0, 15, 255, 0, 127, 255, 0, 127, 255, 0, 127, 255, 255, 255]),
        19);
    });

    it('should split the buffer into two parts if it spans multiple regions', () => {
      const display = require('./display');
      const { writeChar, digits } = display;
      writeChar(zero, 24, 19, 100, 0);

      expect(mocks.SPI1.send).toHaveBeenCalledWith(6, 19);
      expect(mocks.SPI1.send).toHaveBeenCalledWith(
        new Uint8Array([255, 0, 127, 255, 0, 127, 248, 0, 15, 248, 0, 15, 248, 0, 15, 199, 255, 129]),
        19);

      expect(mocks.SPI1.send).toHaveBeenCalledWith(13, 19);
      expect(mocks.SPI1.send).toHaveBeenCalledWith(
        new Uint8Array([199, 255, 129, 199, 255, 129, 199, 255, 241, 199, 255, 241, 192, 255, 241, 192, 255, 241, 192, 0, 1, 248, 0, 15, 248, 0, 15, 255, 0, 127, 255, 0, 127, 255, 0, 127, 255, 255, 255]),
        19);
    });
  });
});
