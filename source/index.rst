.. electronic-docs-template documentation master file, created by
   sphinx-quickstart on Wed Oct  8 12:38:32 2025.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to electronic-docs-template!
======================================

This is a Sphinx documentation template specifically designed for electronic circuit documentation, featuring integrated circuit simulation and timing diagram capabilities.
View the `GitHub repository <https://github.com/swcxito/electronic-docs-template>`_ for more information.

Features
--------

use ``wavedrom`` to show the waveform.
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

code like:

.. code-block:: rst

   .. wavedrom::
      { "signal": [
               { "name": "clk",  "wave": "P......" },
               { "name": "bus",  "wave": "x.==.=x", "data": ["head", "body", "tail", "data"] },
               { "name": "wire", "wave": "0.1..0." }
      ]}

renders as:

.. wavedrom::

        { "signal": [
                { "name": "clk",  "wave": "P......" },
                { "name": "bus",  "wave": "x.==.=x", "data": ["head", "body", "tail", "data"] },
                { "name": "wire", "wave": "0.1..0." }
        ]}



use ``circuitjs`` to show the circuit.
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

code like:

.. code-block:: rst

   .. circuit:: CQAgjCAMB0l3BWcMBMcUHYMGZIA4UA2ATmIxAUgpABZsKBTAWjDACgAncDQkPK7Hhp8qVMJDYBnEIOH9aNPCKjgQAMwCGAG0kM2Ad2695YHjIQoobAMYyh5y6d7YLtKLHhgkTGtEEWwbGwMSAsUMDx6FlE2LTs5AXsXSzF3SFY8YjQ8MDIaMEJCGhRiKwA3BSVkyuVRWiokOpgETniHGuqxODYAezcilRpIUhA0NMbRt2xemRABqiGRsZhQ1Ut6ab6qefqRmEIURtgkSxSZNkFZgDEIUQ9PNLhxCBYQAGENAAcNawBLABcNAA7ax6S7CG4qFYQMCwF4QACSQIAJgBXayAkFgpRUSGpZ4gV4AJQYkl+kkxoLYAAtVMJpkA
      :running: true
      :hide-sidebar: false
      :height: 600px

renders as:

.. circuit:: CQAgjCAMB0l3BWcMBMcUHYMGZIA4UA2ATmIxAUgpABZsKBTAWjDACgAncDQkPK7Hhp8qVMJDYBnEIOH9aNPCKjgQAMwCGAG0kM2Ad2695YHjIQoobAMYyh5y6d7YLtKLHhgkTGtEEWwbGwMSAsUMDx6FlE2LTs5AXsXSzF3SFY8YjQ8MDIaMEJCGhRiKwA3BSVkyuVRWiokOpgETniHGuqxODYAezcilRpIUhA0NMbRt2xemRABqiGRsZhQ1Ut6ab6qefqRmEIURtgkSxSZNkFZgDEIUQ9PNLhxCBYQAGENAAcNawBLABcNAA7ax6S7CG4qFYQMCwF4QACSQIAJgBXayAkFgpRUSGpZ4gV4AJQYkl+kkxoLYAAtVMJpkA
   :running: true
   :hide-sidebar: false
   :height: 600px

when error happens on circuit, you will see:

.. circuit:: errortest
